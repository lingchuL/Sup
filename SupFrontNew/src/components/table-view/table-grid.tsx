"use client"

import { useRef, useEffect, useMemo, useCallback } from "react"
import { HotTable, HotTableClass } from "@handsontable/react"
import Handsontable from "handsontable"
import { registerAllModules } from "handsontable/registry"
import { TbData, TbColInfo } from "@/lib/types"

import "handsontable/dist/handsontable.full.min.css"

// Register all Handsontable modules
registerAllModules()

interface TableGridProps {
  data: TbData
  fixedTopRow: number
  readOnlyRow: number
  fixedColumns?: string[]
  searchResults?: string[]
  errorCells?: string[]
  errorComments?: Record<string, string>
  hiddenRows?: number[]
  hiddenCols?: number[]
  hasImg?: boolean
  useIdx?: boolean
  onAfterChange?: (changes: any, source: string) => void
  onSelectionChange?: (row: number, col: number) => void
  hotRef?: React.RefObject<HotTableClass>
}

export function TableGrid(props: TableGridProps) {
  const localRef = useRef<HotTableClass>(null)
  const hotRef = props.hotRef || localRef

  const columns = props.data?.columns || []
  const rows = props.data?.rows || []

  // Column headers
  const colHeaders = useMemo(() => {
    return columns.map((col) => {
      const name = col.rname || col.name
      const hasFormula = col.formula ? " \u2731" : ""
      const isAux = col.c_type === "sup" ? " \u25cb" : ""
      return `${name}${hasFormula}${isAux}`
    })
  }, [columns])

  // Column widths
  const colWidths = useMemo(() => {
    return columns.map((col) => col.width || 130)
  }, [columns])

  // Data schema for new rows
  const dataSchema = useMemo(() => {
    const schema: Record<string, any> = {}
    columns.forEach((col) => {
      schema[col.name] = col.default_v ?? ""
    })
    return schema
  }, [columns])

  // Cell properties function
  const cells = useCallback((row: number, col: number) => {
    const cellProps: Record<string, any> = {}

    // Fixed top rows are read-only
    if (row < props.fixedTopRow) {
      cellProps.readOnly = true
      cellProps.renderer = function (instance: any, td: any, row: number, col: number, prop: any, value: any) {
        Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, {} as any)
        td.style.background = "#CCEECC"
        td.style.fontWeight = "bold"
      }
    }

    // Error cells
    if (props.errorCells) {
      const key = `${row}_${col}`
      if (props.errorCells.includes(key)) {
        cellProps.renderer = function (instance: any, td: any, row: number, col: number, prop: any, value: any) {
          Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, {} as any)
          td.style.background = "#ff5454"
          td.style.color = "white"
        }
        if (props.errorComments?.[key]) {
          cellProps.comment = { value: props.errorComments[key] }
        }
      }
    }

    // Search result highlighting
    if (props.searchResults) {
      const key = `${row}_${col}`
      if (props.searchResults.includes(key)) {
        const prevRenderer = cellProps.renderer
        cellProps.renderer = function (instance: any, td: any, row: number, col: number, prop: any, value: any) {
          if (prevRenderer) prevRenderer(instance, td, row, col, prop, value)
          else Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, {} as any)
          td.style.background = "#fcedd9"
        }
      }
    }

    // Non-export columns (c_type === "sup")
    if (col < columns.length && columns[col]?.c_type === "sup") {
      cellProps.renderer = function (instance: any, td: any, row: number, col: number, prop: any, value: any) {
        Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, {} as any)
        td.style.background = "#ebffe9"
      }
    }

    return cellProps
  }, [props.fixedTopRow, props.errorCells, props.errorComments, props.searchResults, columns])

  // Column definitions for HotTable
  const hotColumns = useMemo(() => {
    return columns.map((col) => {
      const colDef: Record<string, any> = { data: col.name }

      // Type-specific editors
      if (col.type === "bool") {
        colDef.type = "dropdown"
        colDef.source = ["true", "false"]
      } else if (col.type === "int" || col.type === "float") {
        colDef.type = "numeric"
      } else if (col.options && Array.isArray(col.options) && col.options.length > 0) {
        colDef.type = "dropdown"
        colDef.source = col.options
      }

      return colDef
    })
  }, [columns])

  if (!props.data || columns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)] text-[13px]">
        选择表格以加载数据
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <HotTable
        ref={hotRef}
        data={rows}
        dataSchema={dataSchema}
        rowHeaders={true}
        colHeaders={colHeaders}
        columns={hotColumns}
        height="100%"
        width="100%"
        filters={true}
        comments={true}
        autoWrapCol={false}
        autoWrapRow={false}
        autoRowSize={false}
        colWidths={colWidths}
        rowHeights={props.hasImg ? 60 : 23}
        wordWrap={false}
        fixedRowsTop={props.fixedTopRow}
        minSpareRows={1}
        search={true}
        manualColumnFreeze={true}
        manualColumnResize={true}
        manualRowResize={true}
        licenseKey="non-commercial-and-evaluation"
        afterChange={props.onAfterChange}
        cells={cells}
        hiddenRows={{ rows: props.hiddenRows || [], indicators: false }}
        hiddenColumns={{ columns: props.hiddenCols || [], indicators: false }}
        contextMenu={{
          items: {
            row_above: {},
            row_below: {},
            separator1: "---------" as any,
            undo: {},
            redo: {},
            separator2: "---------" as any,
            cut: {},
            copy: {},
            separator3: "---------" as any,
            hidden_columns_hide: {},
            hidden_columns_show: {},
          },
        }}
        afterSelection={(row: number, col: number) => {
          props.onSelectionChange?.(row, col)
        }}
      />
    </div>
  )
}
