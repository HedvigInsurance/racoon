import toast from 'react-hot-toast'

export interface FileInput {
  displayName: string
  url: string
  mimeType?: string
}

export const downloadFile = async ({
  displayName,
  url,
  mimeType,
}: FileInput) => {
  try {
    // Trick: create an invisible a-tag with download attribute, click it
    // and remove it.
    const link = document.createElement('a')
    link.setAttribute('download', getFilename(displayName, mimeType))
    link.href = url
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error downloading file:', error)
    toast.error('Error downloading file')
  }
}

interface BlobResult {
  filename: string
  blob: Blob
}

export const getBlobFromUrl = async ({
  displayName,
  url,
  mimeType,
}: FileInput): Promise<BlobResult> => {
  const filename = getFilename(displayName, mimeType)

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include', // cookie needed to download URL
  })
  const blob = await response.blob()
  return {
    filename,
    blob,
  }
}

export const getFilename = (displayName: string, mimeType?: string): string =>
  mimeType && !displayName.includes('.')
    ? `${displayName}.${FileMimeTypeExtension[mimeType]}`
    : displayName

export function getFileExtension(filename: string): string | undefined {
  return filename.split('.').at(-1)?.toLowerCase()
}

export const FileMimeTypeExtension: Record<string, string> = {
  'audio/x-mpeg': 'mpega',
  'audio/x-m4a': 'm4a',
  'application/postscript': 'ps',
  'audio/x-aiff': 'aiff',
  'application/x-aim': 'aim',
  'image/x-jg': 'art',
  'video/x-ms-asf': 'asx',
  'audio/basic': 'ulw',
  'video/x-msvideo': 'avi',
  'video/x-rad-screenplay': 'avx',
  'application/x-bcpio': 'bcpio',
  'image/bmp': 'dib',
  'text/html': 'html',
  'application/x-cdf': 'cdf',
  'application/pkix-cert': 'cer',
  'application/java': 'class',
  'application/x-cpio': 'cpio',
  'application/x-csh': 'csh',
  'text/css': 'css',
  'text/csv': 'csv',
  'application/msword': 'doc',
  'application/xml-dtd': 'dtd',
  'video/x-dv': 'dv',
  'application/x-dvi': 'dvi',
  'application/vnd.ms-fontobject': 'eot',
  'text/x-setext': 'etx',
  'image/gif': 'gif',
  'application/x-gtar': 'gtar',
  'application/x-gzip': 'gz',
  'application/x-hdf': 'hdf',
  'application/mac-binhex40': 'hqx',
  'text/x-component': 'htc',
  'image/ief': 'ief',
  'text/vnd.sun.j2me.app-descriptor': 'jad',
  'application/java-archive': 'jar',
  'text/x-java-source': 'java',
  'application/x-java-jnlp-file': 'jnlp',
  'image/jpeg': 'jpg',
  'application/javascript': 'js',
  'text/plain': 'txt',
  'application/json': 'json',
  'audio/midi': 'midi',
  'application/x-latex': 'latex',
  'audio/x-mpegurl': 'm3u',
  'image/x-macpaint': 'pnt',
  'text/troff': 'tr',
  'application/mathml+xml': 'mathml',
  'application/x-mif': 'mif',
  'video/quicktime': 'qt',
  'video/x-sgi-movie': 'movie',
  'audio/mpeg': 'mpa',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpg',
  'video/mpeg2': 'mpv2',
  'application/x-wais-source': 'src',
  'application/x-netcdf': 'nc',
  'application/oda': 'oda',
  'application/vnd.oasis.opendocument.database': 'odb',
  'application/vnd.oasis.opendocument.chart': 'odc',
  'application/vnd.oasis.opendocument.formula': 'odf',
  'application/vnd.oasis.opendocument.graphics': 'odg',
  'application/vnd.oasis.opendocument.image': 'odi',
  'application/vnd.oasis.opendocument.text-master': 'odm',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.graphics-template': 'otg',
  'application/vnd.oasis.opendocument.text-web': 'oth',
  'application/vnd.oasis.opendocument.presentation-template': 'otp',
  'application/vnd.oasis.opendocument.spreadsheet-template': 'ots',
  'application/vnd.oasis.opendocument.text-template': 'ott',
  'application/ogg': 'ogx',
  'video/ogg': 'ogv',
  'audio/ogg': 'spx',
  'application/x-font-opentype': 'otf',
  'audio/flac': 'flac',
  'application/annodex': 'anx',
  'audio/annodex': 'axa',
  'video/annodex': 'axv',
  'application/xspf+xml': 'xspf',
  'image/x-portable-bitmap': 'pbm',
  'image/pict': 'pict',
  'application/pdf': 'pdf',
  'image/x-portable-graymap': 'pgm',
  'audio/x-scpls': 'pls',
  'image/png': 'png',
  'image/x-portable-anymap': 'pnm',
  'image/x-portable-pixmap': 'ppm',
  'application/vnd.ms-powerpoint': 'ppt',
  'image/vnd.adobe.photoshop': 'psd',
  'image/x-quicktime': 'qtif',
  'image/x-cmu-raster': 'ras',
  'application/rdf+xml': 'rdf',
  'image/x-rgb': 'rgb',
  'application/vnd.rn-realmedia': 'rm',
  'application/rtf': 'rtf',
  'text/richtext': 'rtx',
  'application/font-sfnt': 'sfnt',
  'application/x-sh': 'sh',
  'application/x-shar': 'shar',
  'application/x-stuffit': 'sit',
  'application/x-sv4cpio': 'sv4cpio',
  'application/x-sv4crc': 'sv4crc',
  'image/svg+xml': 'svgz',
  'application/x-shockwave-flash': 'swf',
  'application/x-tar': 'tar',
  'application/x-tcl': 'tcl',
  'application/x-tex': 'tex',
  'application/x-texinfo': 'texinfo',
  'image/tiff': 'tiff',
  'text/tab-separated-values': 'tsv',
  'application/x-font-ttf': 'ttf',
  'application/x-ustar': 'ustar',
  'application/voicexml+xml': 'vxml',
  'image/x-xbitmap': 'xbm',
  'application/xhtml+xml': 'xhtml',
  'application/vnd.ms-excel': 'xls',
  'application/xml': 'xsl',
  'image/x-xpixmap': 'xpm',
  'application/xslt+xml': 'xslt',
  'application/vnd.mozilla.xul+xml': 'xul',
  'image/x-xwindowdump': 'xwd',
  'application/vnd.visio': 'vsd',
  'audio/x-wav': 'wav',
  'image/vnd.wap.wbmp': 'wbmp',
  'text/vnd.wap.wml': 'wml',
  'application/vnd.wap.wmlc': 'wmlc',
  'text/vnd.wap.wmlsc': 'wmls',
  'application/vnd.wap.wmlscriptc': 'wmlscriptc',
  'video/x-ms-wmv': 'wmv',
  'application/font-woff': 'woff',
  'application/font-woff2': 'woff2',
  'model/vrml': 'wrl',
  'application/wspolicy+xml': 'wspolicy',
  'application/x-compress': 'z',
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.apple.keynote': 'key',
  'application/vnd.apple.numbers': 'numbers',
  'application/vnd.apple.pages': 'pages',
  'application/vnd.android.package-archive': 'apk',
  'application/x-7z-compressed': '7z',
  'application/x-tika-msoffice': 'ms-office',
  'application/x-tika-ooxml': 'ooxml',
  'application/x-tika-iwork': 'iwork',
  'application/x-tika-epub+zip': 'epub',
  'application/epub+zip': 'epub',
  'application/vnd.google-earth.kml+xml': 'kml',
  'application/vnd.google-earth.kmz': 'kmz',
  'application/vnd.oasis.opendocument.text-flat-xml': 'fodt',
  'application/vnd.oasis.opendocument.spreadsheet-flat-xml': 'fods',
  'application/vnd.oasis.opendocument.presentation-flat-xml': 'fodp',
  'application/vnd.oasis.opendocument.graphics-flat-xml': 'fodg',
  'application/vnd.oasis.opendocument.text-master-flat-xml': 'fodm',
  'application/vnd.oasis.opendocument.text-template-flat-xml': 'fott',
  'application/vnd.oasis.opendocument.presentation-template-flat-xml': 'fotp',
  'application/vnd.oasis.opendocument.spreadsheet-template-flat-xml': 'fots',
  'application/vnd.oasis.opendocument.graphics-template-flat-xml': 'fotg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
    'dotx',
  'application/vnd.openxmlformats-officedocument.presentationml.template':
    'potx',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
    'ppsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
    'xltx',
  'application/vnd.ms-powerpoint.template.macroenabled.12': 'potm',
  'application/vnd.ms-powerpoint.slideshow.macroenabled.12': 'ppsm',
  'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
  'application/vnd.apple.mpegurl': 'm3u8',
  'video/x-matroska': 'mkv',
  'video/webm': 'webm',
  'audio/x-ms-wma': 'wma',
  'audio/x-pn-realaudio': 'ra',
  'audio/x-realaudio': 'ra',
  'audio/vnd.wave': 'wav',
  'audio/webm': 'weba',
  'audio/aac': 'aac',
  'audio/x-m4r': 'm4r',
  'audio/mp3': 'mp3',
  'audio/x-midi': 'mid',
  'audio/mpeg3': 'mp3',
  'audio/mpg': 'mp3',
  'audio/wav': 'wav',
  'audio/x-ms-wax': 'wax',
  'audio/wave': 'wav',
  'video/3gpp': '3gp',
  'video/3gpp2': '3g2',
  'video/avi': 'avi',
  'video/msvideo': 'avi',
  'video/divx': 'divx',
  'video/flv': 'flv',
  'video/m4v': 'm4v',
  'video/mpg': 'mpg',
  'video/x-quicktime': 'mov',
  'video/x-flv': 'flv',
  'video/x-f4v': 'f4v',
  'video/x-m4v': 'm4v',
  'video/x-ms-asx': 'asx',
  'video/x-ms-wmx': 'wmx',
  'video/x-ms-wvx': 'wvx',
  'video/x-ms-wm': 'wm',
  'video/x-ms-wmp': 'wmp',
  'video/x-ms-wmd': 'wmd',
  'video/x-ms-wmz': 'wmz',
}
