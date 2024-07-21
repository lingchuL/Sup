export function IsVideoFile(fileName: string) {
    let videoExtensions = [".mp4", ".MP4", ".webm", ".wmv", ".mov", ".MOV"];
    for (const ext of videoExtensions) {
        if (fileName.endsWith(ext)) return true
    }
    return false
}

export function IsImageFile(fileName: string) {
    let videoExtensions = [".jpg", ".png", ".jiff", ".jpeg", ".webp"];
    for (const ext of videoExtensions) {
        if (fileName.endsWith(ext)) return true
    }
    return false
}