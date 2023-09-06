import Productmanager from "../services/db/Productmanager.js"
// import Productmanager from "../services/fs/Productmanager.js"


class Productcontroller{

    getProducts = async (req, res) => {
        try {
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const {category, status} = req.query
            const sortOrder = req.query.sort === "asc" || req.query.sort === "desc"? req.query.sort : false
            const filter = {}
            
            //objeto para hacer la consulta en mongo
            if(category){
                filter.category = { $regex: `\\b${category}\\b`, $options: 'i' }
            }
    
            if(status){
                filter.status = status
            }
           
            let listaProductos = await Productmanager.getProducts(limit,page,filter,sortOrder)
            
            res.status(200).send({status:"succes", payload:listaProductos})
        } catch (error) {
            res.status(500).send({message:`Error al lista de archivos de la base de datos: ${error}`})

        }
    }
    
    getProductsById = async (req, res) => {
        try {
            const {pid} = req.params
            let productById = await Productmanager.getProductsById(pid)
            res.status(200).send({result:"Succes", payload:productById})
        } catch (error) {
            res.status(500).send({message: `Error al obtener id:${error}`})
        }
       
    }

    viewProducts = async (req, res) => {
        try {
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const {category, status} = req.query
            const sortOrder = req.query.sort === "asc" || req.query.sort === "desc"? req.query.sort : false
            const filter = {}
    
            if(category){
                filter.category = { $regex: `\\b${category}\\b`, $options: 'i' }
            }
    
            if(status){
                filter.status = status
            }


            let productList = await Productmanager.getProducts(limit,page,filter,sortOrder)
            
            if(productList.docs.length === 0){
                res.status(400).render('error', {error:"Error en los parametros de busqueda"})
            }else{
                //se captura la url de la solicitud, se parsean sus querys y se actualizan a partir del objeto obtenido. Esto permite que no importa el orden de las querys, los objetos prevLink y netxLink funcionan
            
                let parsedUrl = req.originalUrl
                

                let isQueryEmpty = JSON.stringify(req.query) === '{}'
                
                if(isQueryEmpty){
                    parsedUrl += '?'
                }
                
                const parsedUrlParams = new URLSearchParams(parsedUrl)

                //se genern las propiedad prevLink y nextLink para 
    
                if(productList.hasNextPage === true){
                    if(parsedUrlParams.has('page')){
                        parsedUrlParams.set('page', productList.page +1)
                        const urlToString = parsedUrlParams.toString()
                        const decodedUrl = decodeURIComponent(urlToString)
                        
                        productList.nextLink = decodedUrl
                    }
                    else{
                        parsedUrlParams.append('page', productList.page +1)
                        const urlToString = parsedUrlParams.toString()
                        const decodedUrl = decodeURIComponent(urlToString)
                        productList.nextLink = decodedUrl
                    }
                }else{
                    productList.nextLink = null
                }

                if(productList.hasPrevPage){
                    if(parsedUrlParams.has('page')){
                        parsedUrlParams.set('page', productList.page -1)
                        parsedUrlParams.toString()
                        const decodedUrl = decodeURIComponent(parsedUrlParams)
                        productList.prevLink = decodedUrl
                    }else{
                        parsedUrlParams.append('page', productList.page -1)
                        parsedUrlParams.toString()
                        const decodedUrl = decodeURIComponent(parsedUrlParams)
                        productList.prevLink = decodedUrl
                    }
                }else{
                    productList.prevLink = null
                }
                
                //conversion del objeto de mongo para renderizarlo en handlebars
                let productListJSON = JSON.parse(JSON.stringify(productList))
                const {user} = req.session
                res.status(200).render('productslist', {
                        productListJSON,
                        style:"index.css",
                        user
                })
             }
        } catch (error) {
            res.status(500).render('error',{error})

        }
    }

    viewProductsById = async (req, res) => {
        try {
            const {pid} = req.params
            const productById = await Productmanager.getProductsById(pid)
            if(productById._id){
                res.status(200).render('productdetails', {
                    productById,
                    style:"index.css"
                })
            }else{
                res.status(400).render('error', {error:`No existe producto con id ${pid}`})
            }
            
        } catch (error) {
            res.status(500).send({message: `Error al obtener id:${error}`})
        }
    }
    
    addProducts = async (req, res) => {
        try {
            const {title, description, code, price, category, thumbnails} = req.body
            const nuevoProducto = {
                title,
                description,
                code,
                price,
                category,
                thumbnails,
            }
            let nuevoProductoPayload = await Productmanager.addProducts(nuevoProducto)
            res.status(201).send({status:"Producto agregado", payload: nuevoProductoPayload})
        } catch (error) {
            res.status(500).send({message:`Error al añadir producto a la base de datos: ${error}`})
        }
    }

    updateProducts = async (req, res) => {
        try {
            const {pid} = req.params
            const productUpdated = req.body
            let updateResult = await Productmanager.updateProducts(pid, productUpdated)
            if(updateResult._id){
                res.status(201).send({result:"Succes", payload:updateResult})
            }else{
                res.status(400).render('error', {error:`No existe producto con id ${pid}`})
            }            
        } catch (error) {
            res.status(500).send({message: 'Id no encontrado'})   
        }
    }
    
    deleteProducts = async (req, res) => {
        try {
            const {pid} = req.params
            let deleteResultPayload = await Productmanager.deleteProducts(pid)
            res.send({result:'Succes', payload:deleteResult})
            if(deleteResult.acknowledged === true){
                res.status(200).send({result:"Succes", payload:deleteResultPayload})
            }else{
                res.status(401).send({result:"error", payload:`No existe el carrito con el id ${cid}`})
            }
        } catch (error) {
            res.status(500).send({ message: 'Error al eliminar producto'})   
        }
        
    }
}

export default new Productcontroller