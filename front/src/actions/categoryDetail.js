export const selectCat = catId =>{
    return {
        type:'selected_cat',
        payload:catId
    }
}