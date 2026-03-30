// Core type definitions - ported from SupFront

export interface ResultResp {
  result: string
  status_code: string
}

export interface FileSize {
  file_full_path: string
  file_size: string
  hash?: string
}

export interface DropFileInfo {
  file_full_path: string
  file_size: string
  uri: string
}

export interface TbColInfo {
  note: string
  rdesc: string
  rname: string
  name: string
  type: string
  req_or_opt: string
  default_v: string
  c_type: string
  formula: string
  c_index?: string
  j_type?: string
  src?: string
  options: any[] | string
  key?: string
  width?: number
  show?: boolean
}

export interface JDBTbData {
  db_key?: string
  rows?: any[]
  [key: string]: any
}

export interface TbData extends JDBTbData {
  columns: TbColInfo[]
}

export interface AntdOption {
  value: string
  label: string
  children?: AntdOption[]
}

export interface FromToItem {
  rel_dir: string
  idx_name: string
  rid: string | number
}

export interface HTableSOpData {
  op: string
  changedRowNumDatas: {
    [idx: number]: any
  }
}

// Tab system types (new for SupFrontNew)
export type TabType = 'workspace' | 'table_view' | 'table_info' | 'settings'

export interface TabItem {
  id: string
  type: TabType
  label: string
  closable: boolean
  data?: any // tab-specific data (e.g. dbKey for table_view)
}
