import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductById();
    }, []);

    const getProductById = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/products/${id}`);
            const data = response.data.data;
            setTitle(data.name)
            setFile(data.image)
            setPreview(data.url)
        } catch (error) {
            console.error(error);
        }
    };

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
            await axios.patch(`http://localhost:3000/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='columns is-centered mt-5'>
            <div className='column is-half'>
                <form onSubmit={updateProduct}>
                    <div className='field'>
                        <label className='label'>Product Name</label>
                        <div className='control'>
                            <input
                                type='text'
                                className='input'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Product Name'
                            />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label'>Image</label>
                        <div className='control'>
                            <div className='file'>
                                <label className='file-label'>
                                    <input
                                        type='file'
                                        className='file-input'
                                        onChange={loadImage}
                                    />
                                    <span className='file-cta'>
                                        <span className='file-label'>
                                            Choose a file...
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {preview && (
                        <figure>
                            <img
                                src={preview}
                                alt='preview image'
                                width={100}
                                height={100}
                            />
                        </figure>
                    )}

                    <div className='field mt-10'>
                        <div className='control'>
                            <button type='submit' className='button is-success'>
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
