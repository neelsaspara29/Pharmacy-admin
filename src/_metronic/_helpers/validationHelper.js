const validationMedicineData = (obj) => {
  



    let pack = obj.pack;
    if (isNaN(pack))
        return {res:"Pack Value Must Be Number",state:3};
    
    let mrp = obj.mrp;
    if (isNaN(mrp))
        return {res:"MRP Value Must Be Number",state:3};
    let ptr = obj.ptr;
    if (isNaN(ptr))
        return {res:"PTR Value Must Be Number",state:3};
    let gst = obj.gst;
    if (isNaN(gst))
        return {res:"GST Value Must Be Number",state:4};
    let stocks = obj.stocks;
    if (isNaN(stocks))
        return {res:"Stocks Value Must Be Number",state:3};
    let marginalDiscount = obj.marginalDiscount;
    if (isNaN(marginalDiscount))
        return {res:"Discount Value Must Be Number",state:3};

    

    
    
   
    
   




    return true;
}
export { validationMedicineData };