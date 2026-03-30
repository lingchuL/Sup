// CoPiper utility functions - ported from SupFront copiper_utils.tsx

import { TbColInfo, AntdOption } from "@/lib/types"

export function isValidValue(v: any, strCanEmpty = false, numberCanZero = true, booleanCanFalse = true) {
  if (v === undefined || v === null) return false
  if (typeof v === "string") return strCanEmpty ? true : v.length > 0
  if (typeof v === "number") return numberCanZero ? true : v != 0
  if (typeof v === "boolean") return booleanCanFalse ? true : v
}

export function ensureVType(v: any, vType: string): any {
  if (!isValidValue(v)) return v
  if (v == "#") return "#"
  if (typeof v === vType) return v
  if (vType.startsWith("list:")) {
    const eVType = vType.substring(5)
    if (v == "[]") return "[]"
    if (Array.isArray(v)) return v.map((e) => String(ensureVType(e, eVType))).join("|")
    return String(v)
      .split("|")
      .map((e) => String(ensureVType(e, eVType)))
      .join("|")
  }
  if (vType.startsWith("index")) return String(v)
  if (vType.startsWith("indices/")) {
    if (v == "[]") return "[]"
    if (Array.isArray(v)) return v.map((e) => String(ensureVType(e, "index"))).join("|")
    return String(v)
      .split("|")
      .map((e) => String(ensureVType(e, "index")))
      .join("|")
  }
  if (["int", "float"].includes(vType)) return Number(v)
  if (["str", "Tstr", "Istr"].includes(vType)) return String(v)
  if (vType == "bool") {
    if (["", null].includes(v)) return null
    return [true, "TRUE", "1", 1, "True", "true"].includes(v)
  }
  if (vType.startsWith("ckv")) return typeof v === "object" ? JSON.stringify(v) : String(v)
  if (vType.startsWith("list:ckv")) return typeof v === "object" ? JSON.stringify(v) : String(v)
  if (vType != "\u7c7b\u578b") console.warn(`\u503c ${v} \u9884\u671f\u7c7b\u578b\u4e3a ${vType} \u5728\u5de5\u5177\u8bbe\u8ba1\u8303\u56f4\u5916\uff0c\u4e0d\u8fdb\u884c\u5904\u7406`)
  return v
}

export function getNestedProperty(obj: any, path: string): any {
  return path.split(".").reduce((acc: any, part: string) => acc && acc[part], obj)
}

export function ensureRowVType(row: any, columns: TbColInfo[]) {
  for (const col of columns) {
    if (!col.name?.startsWith("_sup") && !col.name?.startsWith("#") && col.type) {
      const name = col.name
      let v = getNestedProperty(row, name)
      v = ensureVType(v, col.type)
      if (isValidValue(v)) row = setRowKV(row, name, v)
    }
  }
  return row
}

export function setRowKV(row: any, k: string, v: any) {
  row[k] = v
  return row
}

export function dbKeyToCasVs(dbKey: string) {
  if (!dbKey) return []
  const dbKey_split = dbKey.split("_")
  if (dbKey_split.length < 3) return []
  return [dbKey_split[0], dbKey_split.slice(1, -1).join("_"), dbKey_split.at(-1) ?? ""]
}

/** Parse options with ^ separator: "value^comment" -> {value: "value", label: "value comment"} */
export function parseCaretOptions(options: string[]): AntdOption[] {
  return options.map((opt) => {
    const ci = opt.indexOf("^")
    if (ci >= 0) {
      return { value: opt.substring(0, ci), label: opt.substring(0, ci) + " " + opt.substring(ci + 1) }
    }
    return { label: opt, value: opt }
  })
}
