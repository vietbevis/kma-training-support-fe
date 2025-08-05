import { useCallback, useEffect, useRef, useState } from 'react'
import { createSearchParams, useSearchParams, type SetURLSearchParams, type URLSearchParamsInit } from 'react-router'
import { useDebounce } from './useDebounce'

function mergeSearchParams(current: URLSearchParams, updates: URLSearchParamsInit | null): URLSearchParams {
  const result = new URLSearchParams(current)

  if (updates === null) {
    return new URLSearchParams()
  }

  const updatesParams = createSearchParams(updates)

  for (const [key, value] of updatesParams) {
    if (!value || value.trim() === '') {
      result.delete(key)
    } else {
      result.set(key, value)
    }
  }

  return result
}

type Pending = {
  next: URLSearchParamsInit
  options?: Parameters<SetURLSearchParams>[1]
}

type SmartSetURLSearchParams = (
  nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit) | null,
  navigateOptions?: Parameters<SetURLSearchParams>[1]
) => void

function areSearchParamsEqual(a: URLSearchParams, b: URLSearchParams): boolean {
  if (a.size !== b.size) return false

  for (const [key, value] of a) {
    if (b.get(key) !== value) return false
  }

  return true
}

export function useDebounceSearchParams(delay: number = 500): [URLSearchParams, SmartSetURLSearchParams] {
  const [searchParams, setSearchParams] = useSearchParams()
  const isUpdatingRef = useRef(false)

  const [pending, setPending] = useState<Pending>({
    next: searchParams,
    options: undefined
  })

  const debouncedPending = useDebounce(pending, delay)

  useEffect(() => {
    const { next, options } = debouncedPending

    const currentParams = new URLSearchParams(searchParams)
    const nextParams = createSearchParams(next)

    if (!areSearchParamsEqual(currentParams, nextParams)) {
      isUpdatingRef.current = true
      setSearchParams(next, options)

      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    }
  }, [debouncedPending, setSearchParams, searchParams])

  useEffect(() => {
    if (!isUpdatingRef.current) {
      setPending({ next: searchParams, options: undefined })
    }
  }, [searchParams])

  const current = createSearchParams(pending.next)

  const setDebouncedSearchParams: SmartSetURLSearchParams = useCallback(
    (nextInit, navigateOptions) => {
      let resolvedNext: URLSearchParams

      if (nextInit === null) {
        resolvedNext = new URLSearchParams()
      } else if (nextInit === undefined) {
        resolvedNext = createSearchParams(pending.next)
      } else if (typeof nextInit === 'function') {
        const currentParams = createSearchParams(pending.next)
        const functionResult = nextInit(currentParams)
        resolvedNext = mergeSearchParams(currentParams, functionResult)
      } else {
        const currentParams = createSearchParams(pending.next)
        resolvedNext = mergeSearchParams(currentParams, nextInit)
      }

      setPending({ next: resolvedNext, options: navigateOptions })
    },
    [pending.next]
  )

  return [current, setDebouncedSearchParams]
}
