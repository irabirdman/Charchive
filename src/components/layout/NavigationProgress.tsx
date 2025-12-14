'use client'

import { useEffect, useState, useTransition, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentPathRef = useRef(pathname)

  // Show loading immediately on link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Ignore clicks on buttons (like mobile menu hamburger)
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        return
      }
      
      const link = target.closest('a[href]')
      
      if (link) {
        const href = link.getAttribute('href')
        // Check if it's an internal Next.js link
        if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('http')) {
          // Don't show loading if clicking the same page (check pathname only, ignore query params)
          const hrefPath = href.split('?')[0]
          if (hrefPath === pathname) return
          
          setIsLoading(true)
          setProgress(0)
          
          // Clear any existing interval
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          
          // Simulate progress while waiting
          progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 85) {
                if (progressIntervalRef.current) {
                  clearInterval(progressIntervalRef.current)
                  progressIntervalRef.current = null
                }
                return prev
              }
              return prev + Math.random() * 8
            })
          }, 50)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [pathname])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsLoading(true)
      setProgress(0)
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            return prev
          }
          return prev + Math.random() * 8
        })
      }, 50)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  // Track navigation completion
  useEffect(() => {
    // If pathname or searchParams changed, navigation completed
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const previousPath = `${currentPathRef.current}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    if (currentPathRef.current !== pathname || currentPath !== previousPath) {
      currentPathRef.current = pathname
      
      // Complete the progress bar
      if (isLoading) {
        setProgress(100)
        const timer = setTimeout(() => {
          setIsLoading(false)
          setProgress(0)
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
          }
        }, 300)
        return () => clearTimeout(timer)
      }
    }
    
    // Also handle isPending state from useTransition
    if (!isPending && isLoading) {
      setProgress(100)
      const timer = setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams, isPending, isLoading])

  // Show loading indicator if loading or pending
  if (!isLoading && !isPending) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-800/50">
      <div 
        className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 transition-all duration-300 ease-out"
        style={{
          width: `${Math.min(progress || (isPending ? 30 : 0), 95)}%`,
        }}
      />
    </div>
  )
}

