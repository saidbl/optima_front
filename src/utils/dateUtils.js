export const formatDateUTC = (dateString) => {
    if (!dateString) return 'N/A'

    // Si viene como fecha completa ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    // Tomamos solo la parte de la fecha para evitar problemas de zona horaria
    const onlyDate = dateString.split('T')[0]

    // Dividimos componentes (YYYY, MM, DD)
    const [year, month, day] = onlyDate.split('-').map(Number)

    // Creamos fecha local usando los componentes (mes es 0-indexado)
    // Esto asegura que 2023-12-11 se interprete como 11 de Diciembre localmente
    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

export const formatIsoDateForInput = (dateString) => {
    if (!dateString) return ''
    return dateString.split('T')[0]
}
