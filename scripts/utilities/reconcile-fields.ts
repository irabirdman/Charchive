/**
 * Field Reconciliation Script
 * 
 * Compares DB fields vs Form fields vs API fields and generates a report
 * 
 * Run with: npx tsx scripts/utilities/reconcile-fields.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ReconciliationIssue {
  type: 'missing_in_form' | 'missing_in_api' | 'missing_in_db' | 'type_mismatch' | 'required_mismatch';
  entity: string;
  field: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

interface ReconciliationReport {
  entities: Record<string, {
    dbFields: string[];
    formFields: string[];
    apiFields: string[];
    issues: ReconciliationIssue[];
  }>;
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
  };
}

function loadInventory(fileName: string): any {
  const filePath = path.join(process.cwd(), 'scripts', 'output', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Inventory file not found: ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function mapEntityName(entity: string): string {
  // Map form/API entity names to database table names
  const mapping: Record<string, string> = {
    'OCForm': 'ocs',
    'WorldForm': 'worlds',
    'WorldLoreForm': 'world_lore',
    'TimelineForm': 'timelines',
    'TimelineEventForm': 'timeline_events',
    'ocs': 'ocs',
    'worlds': 'worlds',
    'world-lore': 'world_lore',
    'timeline-events': 'timeline_events',
    'timelines': 'timelines',
  };
  return mapping[entity] || entity;
}

function reconcileFields(): ReconciliationReport {
  const dbFields = loadInventory('db-fields.json');
  const formFields = loadInventory('form-fields.json');
  const apiFields = loadInventory('api-fields.json');

  if (!dbFields || !formFields || !apiFields) {
    throw new Error('Missing inventory files. Please run inventory scripts first.');
  }

  const report: ReconciliationReport = {
    entities: {},
    summary: {
      totalIssues: 0,
      errors: 0,
      warnings: 0,
      infos: 0,
    },
  };

  // Process each entity
  const entities = ['ocs', 'worlds', 'world_lore', 'timelines', 'timeline_events'];

  for (const entity of entities) {
    const entityReport = {
      dbFields: [] as string[],
      formFields: [] as string[],
      apiFields: [] as string[],
      issues: [] as ReconciliationIssue[],
    };

    // Get DB fields
    if (dbFields[entity]) {
      entityReport.dbFields = dbFields[entity].columns.map((c: any) => c.column_name);
    }

    // Get form fields
    const formEntityName = Object.keys(formFields).find(f => 
      mapEntityName(f) === entity
    );
    if (formEntityName && formFields[formEntityName]) {
      entityReport.formFields = formFields[formEntityName].fields.map((f: any) => f.name);
    }

    // Get API fields
    const apiEntityName = Object.keys(apiFields).find(a => 
      mapEntityName(a) === entity
    );
    if (apiEntityName && apiFields[apiEntityName]) {
      // Combine fields from all routes
      const allApiFields = new Set<string>();
      for (const route of apiFields[apiEntityName]) {
        for (const field of route.fields) {
          allApiFields.add(field.name);
        }
      }
      entityReport.apiFields = Array.from(allApiFields);
    }

    // Find issues
    // 1. DB fields not in form
    for (const dbField of entityReport.dbFields) {
      // Skip system fields
      if (['id', 'created_at', 'updated_at'].includes(dbField)) continue;
      
      if (!entityReport.formFields.includes(dbField)) {
        entityReport.issues.push({
          type: 'missing_in_form',
          entity,
          field: dbField,
          description: `Database field "${dbField}" exists but is not in form schema`,
          severity: 'error',
        });
        report.summary.errors++;
      }
    }

    // 2. Form fields not in DB
    for (const formField of entityReport.formFields) {
      if (!entityReport.dbFields.includes(formField)) {
        entityReport.issues.push({
          type: 'missing_in_db',
          entity,
          field: formField,
          description: `Form field "${formField}" exists but is not in database schema`,
          severity: 'warning',
        });
        report.summary.warnings++;
      }
    }

    // 3. Form fields not in API
    for (const formField of entityReport.formFields) {
      if (!entityReport.apiFields.includes(formField)) {
        entityReport.issues.push({
          type: 'missing_in_api',
          entity,
          field: formField,
          description: `Form field "${formField}" exists but is not handled in API`,
          severity: 'error',
        });
        report.summary.errors++;
      }
    }

    // 4. DB fields not in API (for editable fields)
    const editableDbFields = entityReport.dbFields.filter(f => 
      !['id', 'created_at', 'updated_at'].includes(f)
    );
    for (const dbField of editableDbFields) {
      if (!entityReport.apiFields.includes(dbField)) {
        entityReport.issues.push({
          type: 'missing_in_api',
          entity,
          field: dbField,
          description: `Database field "${dbField}" exists but is not handled in API`,
          severity: 'warning',
        });
        report.summary.warnings++;
      }
    }

    report.entities[entity] = entityReport;
    report.summary.totalIssues += entityReport.issues.length;
  }

  report.summary.infos = report.summary.totalIssues - report.summary.errors - report.summary.warnings;

  return report;
}

function generateMarkdownReport(report: ReconciliationReport): string {
  let md = '# Field Reconciliation Report\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  
  md += '## Summary\n\n';
  md += `- **Total Issues**: ${report.summary.totalIssues}\n`;
  md += `- **Errors**: ${report.summary.errors}\n`;
  md += `- **Warnings**: ${report.summary.warnings}\n`;
  md += `- **Infos**: ${report.summary.infos}\n\n`;

  md += '## Issues by Entity\n\n';

  for (const [entity, data] of Object.entries(report.entities)) {
    if (data.issues.length === 0) continue;

    md += `### ${entity}\n\n`;
    md += `- **DB Fields**: ${data.dbFields.length}\n`;
    md += `- **Form Fields**: ${data.formFields.length}\n`;
    md += `- **API Fields**: ${data.apiFields.length}\n`;
    md += `- **Issues**: ${data.issues.length}\n\n`;

    // Group issues by type
    const issuesByType: Record<string, ReconciliationIssue[]> = {};
    for (const issue of data.issues) {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    }

    for (const [type, issues] of Object.entries(issuesByType)) {
      md += `#### ${type.replace(/_/g, ' ').toUpperCase()}\n\n`;
      for (const issue of issues) {
        const icon = issue.severity === 'error' ? '❌' : 
                    issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        md += `${icon} **${issue.field}**: ${issue.description}\n`;
      }
      md += '\n';
    }
  }

  md += '## Field Coverage\n\n';
  md += '| Entity | DB Fields | Form Fields | API Fields | Coverage |\n';
  md += '|--------|-----------|-------------|------------|----------|\n';

  for (const [entity, data] of Object.entries(report.entities)) {
    const dbFieldCount = data.dbFields.length;
    const formFieldCount = data.formFields.length;
    const apiFieldCount = data.apiFields.length;
    
    // Calculate coverage (form fields that exist in DB / total DB fields)
    const editableDbFields = data.dbFields.filter(f => 
      !['id', 'created_at', 'updated_at'].includes(f)
    );
    const coveredFields = editableDbFields.filter(f => 
      data.formFields.includes(f)
    );
    const coverage = editableDbFields.length > 0 
      ? ((coveredFields.length / editableDbFields.length) * 100).toFixed(1)
      : '100.0';
    
    md += `| ${entity} | ${dbFieldCount} | ${formFieldCount} | ${apiFieldCount} | ${coverage}% |\n`;
  }

  return md;
}

async function main() {
  console.log('🔍 Field Reconciliation\n');
  console.log('='.repeat(50));
  console.log();

  try {
    const report = reconcileFields();

    // Save JSON report
    const outputDir = path.join(process.cwd(), 'scripts', 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    const jsonPath = path.join(outputDir, 'reconciliation-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Generate and save Markdown report
    const mdReport = generateMarkdownReport(report);
    const mdPath = path.join(outputDir, 'reconciliation-report.md');
    fs.writeFileSync(mdPath, mdReport);

    console.log(`✅ Reconciliation complete!`);
    console.log(`   JSON report: ${jsonPath}`);
    console.log(`   Markdown report: ${mdPath}`);
    console.log();
    
    // Print summary
    console.log('📊 Summary:');
    console.log(`   Total Issues: ${report.summary.totalIssues}`);
    console.log(`   Errors: ${report.summary.errors}`);
    console.log(`   Warnings: ${report.summary.warnings}`);
    console.log();

    // Print issues by entity
    for (const [entity, data] of Object.entries(report.entities)) {
      if (data.issues.length > 0) {
        console.log(`   ${entity}: ${data.issues.length} issues`);
        const errors = data.issues.filter(i => i.severity === 'error').length;
        const warnings = data.issues.filter(i => i.severity === 'warning').length;
        if (errors > 0) console.log(`      ❌ ${errors} errors`);
        if (warnings > 0) console.log(`      ⚠️  ${warnings} warnings`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
