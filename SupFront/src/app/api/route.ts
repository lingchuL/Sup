export const dynamic = 'force-dynamic' // defaults to force-static
export async function GET() {
    const res = await fetch('http://127.0.0.1:8133/login', {
        headers: {
            "Content-Type": "text/plain"
        },
        method: "GET",
        cache: "no-cache",
    })
    console.log(res)
    const data = await res.text()
    console.log(data)

    return data
}

export async function Get_Json(): Promise<string> {
    const res = await fetch('http://127.0.0.1:8133/login?id=1000', {
        headers: {
            "Content-Type": "text/json"
        },
        method: "GET",
        cache: "no-cache",
    })
    console.log(res)
    const data = await res.text()
    console.log(data)

    return data
}

export async function CallFileAction(path: string, action: string, is_recursively: boolean): Promise<string> {
    let path_param = encodeURIComponent(path)
    let call_file_url = encodeURI('http://127.0.0.1:8133/file?path=' + path_param + "&action=" + action + "&recursively=" + is_recursively)
    console.log(call_file_url)
    const res = await fetch(call_file_url, {
        headers: {
            "Content-Type": "text/json"
        },
        method: "GET",
        cache: "no-cache",
    })
    // console.log(res)
    const data_text = await res.text()
    console.log(data_text)

    return data_text
}