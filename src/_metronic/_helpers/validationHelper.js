const validationMedicineData = (obj) => {
    let name = obj.name;
    if (!name)
        return {res:'Name Is required',state:1};
    
    let description = obj.description;
    if (!description)
        return {res:"Description Is Required",state:1};
    
    let images = obj.mainImage;
    if (!images)
    return {res:"Main Image Is Required(which will show will displaying medicine)",state:2};

    
    let manname = obj.manufacturerName;
    if (!manname)
        return {res: " Manufacture Name Is Required",state:3};

    let pack = obj.pack;
    if (!pack)
        return {res:"Pack Value Must Be Non zero",state:3};
    
    let mrp = obj.mrp;
    if (!mrp)
        return {res:"MRP Value Must Be Non zero",state:3};

    
    
   
    
    let { chemicalComposition, hsnCode, category, tags, ShortDesc } = obj;
    if (!chemicalComposition)
        return {res:"chemicalComposition Is Required",state:4}
    else if (!hsnCode)
        return {res:"HSN Code Is Required",state:4};
    else if (!category)
        return {res:"Category Is Required",state:4};
    else if (!ShortDesc)
        return {res:"ShortDesc is required",state:4};




    return true;
}
export { validationMedicineData };