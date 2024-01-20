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

export async function ParamsGet(url_route: string, params: Map<string, string>): Promise<string> {
    let url_param = ""
    params.forEach(function(value, key) {
        url_param += "&" + key + "=" + value
    })
    let url = encodeURI('http://127.0.0.1:8133/'+ url_route + '?' + url_param.substring(1))
    console.log(url)
    const res = await fetch(url, {
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

export async function CallFileAction(params: Map<string, string>): Promise<string> {
    return await ParamsGet("dir_file", params)
}

export async function CallAudioAction(params: Map<string, string>): Promise<string> {
    return await ParamsGet("audio", params)
}

export async function CallCfgAudioAction(params: Map<string, string>): Promise<string> {
    return await ParamsGet("cfg", params)
}

export async function CallCopilotAction(params: Map<string, string>): Promise<string> {
    return await ParamsGet("copilot", params)
}
