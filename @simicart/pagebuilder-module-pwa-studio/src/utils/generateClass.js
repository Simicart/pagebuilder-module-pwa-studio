export const generateClass = (clo, icl, ...cl) => {
    const entries = (cl || []).filter(x => !!x)
    const listCl = Object.entries(clo || {}).filter(([k, v]) => {
        return entries.includes(k)
    })
    return listCl.map(([k, v]) => v).join(' ') + (icl ? ` ${icl}` : '')
}
