import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

export const useSearchParamsManager = <T extends Record<string, string | undefined | null>>(filters: T) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterKeys = useMemo(() => Object.keys(filters) as (keyof T)[], [filters])

  const currentFilters = useMemo(() => {
    const out = {} as { [K in keyof T]: string }
    filterKeys.forEach((k) => {
      const val = searchParams.get(String(k))
      out[k] = val ?? String(filters[k])
    })
    return out
  }, [searchParams, filters, filterKeys])

  const updateSearchParams = useCallback(
    (updater: (qp: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const qp = new URLSearchParams(prev)
        updater(qp)
        return qp
      })
    },
    [setSearchParams]
  )

  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      updateSearchParams((qp) => {
        if (value === '' || value == null) {
          qp.delete(String(key))
        } else {
          qp.set(String(key), value)
        }
      })
    },
    [updateSearchParams]
  )

  const setFilters = useCallback(
    (next: Partial<Record<keyof T, string>>) => {
      updateSearchParams((qp) => {
        Object.entries(next).forEach(([k, v]) => {
          const key = k as keyof T
          const value = v as string
          if (value === '' || value == null) {
            qp.delete(String(key))
          } else {
            qp.set(String(key), value)
          }
        })
      })
    },
    [updateSearchParams]
  )

  const resetFilters = useCallback(() => {
    setSearchParams(() => {
      const qp = new URLSearchParams()
      filterKeys.forEach((k) => {
        const value = filters[k]
        if (value !== '' && value != null && value !== undefined) {
          qp.set(String(k), value)
        }
      })
      return qp
    })
  }, [filters, filterKeys, setSearchParams])

  return {
    filters: currentFilters,
    setFilter,
    setFilters,
    resetFilters
  }
}
