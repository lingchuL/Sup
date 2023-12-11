export const dynamic = 'force-dynamic' // defaults to force-static
export async function GET() {
    const res = await fetch('http://127.0.0.1:8080/login', {
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
    const res = await fetch('http://127.0.0.1:8080/login?id=1000', {
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
    const res = await fetch('http://127.0.0.1:8080/file?path=' + path + "&action=" + action + "&recursively=" + is_recursively, {
        headers: {
            "Content-Type": "text/json"
        },
        method: "GET",
        cache: "no-cache",
    })
    // console.log(res)
    const data = await res.text()
    // console.log(data)

    return data
}