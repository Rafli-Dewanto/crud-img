import product from '../models/product.model.js';
import fs from 'fs';
import path from 'path'

export const getProducts = async (req, res) => {
    try {
        const data = await product.findAll();
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: data
        })
    } catch (error) {
        console.error(error.message)
    }
}

export const getProductById = async (req, res) => {
    try {
        const data = await product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: data
        })
    } catch (error) {
        console.error(error.message)
    }
}

export const saveProduct = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({
            code: 400,
            status: 'BAD_REQUEST',
            message: 'no file uploaded',
        })
    }

    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg', '.webp'];

    const maxFileSize = 5000000 // 5MB
    
    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({
        code: 422,
        message: 'invalid extension'
    })

    if (fileSize > maxFileSize) return res.status(413).json({
        code: 413,
        message: 'file size must be less than 5MB'
    })

    file.mv(`./public/images/${fileName}`, async (error) => {
        if (error) return res.status(500).json({
            message: error.message
        })

        try {
            await product.create({
                name: name,
                image: fileName,
                url: url
            });

            res.status(201).json({
                message: 'product created successfully'
            })
        } catch (error) {
            console.error(error.message)
        }
    })
}

export const updateProduct = async (req, res) => {
    const data = await product.findOne({
        where: {
            id: req.params.id
        }
    });
    
    if (!data) return res.status(404).json({
        code: 404,
        message: "product not found"
    })

    let fileName = '';
    console.log(req.files);
    

    if (req.files === null) {
        fileName = data.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
        const maxFileSize = 5000000; // 5MB


        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({
            code: 422,
            message: 'invalid extension'
        });
    
        if (fileSize > maxFileSize) return res.status(413).json({
            code: 413,
            message: 'file size must be less than 5MB'
        });

        const filePath = `./public/images/${data.image}`;
        // hapus file dari dir public/images
        fs.unlinkSync(filePath);

        file.mv(`./public/images/${fileName}`, (error) => {
            if (error) return res.status(500).json({
                message: error.message
            });
        });
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

    try {
        await product.update({
            name: name,
            image: fileName,
            url: url
        },{
            where: {
                id: req.params.id
            }
        })

        res.status(200).json({
            code: 200,
            status: 'OK',
            message: 'Product Updated Successfully'
        })

    } catch (error) {
        console.error(error.message)
    }
}

export const deleteProduct = async (req, res) => {
        const data = await product.findOne({
            where: {
                id: req.params.id
            }
        });
        
        if (!data) return res.status(404).json({
            code: 404,
            message: "product not found"
        })

        try {
            const filePath = `./public/images/${data.image}`;

            // hapus file dari dir public/images
            fs.unlinkSync(filePath);

            // hapus data dari database
            await product.destroy({
                where: {
                    id: req.params.id
                }
            });
            

            res.status(200).json({
                code: 200,
                message: "product deleted successfully",
            });

        } catch (error) {
            console.error(error.message)
        }
}