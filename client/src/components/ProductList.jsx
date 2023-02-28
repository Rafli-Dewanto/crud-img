import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const res = await axios.get("http://localhost:3000/products");
        console.log(res.data.data);
        setProducts(res.data.data);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:3000/products/${productId}`)
            getProducts()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='container mt-5'>
            <Link to='/add' className="button is-success">Add new</Link>
            <div className='columns is-multiline'>
                {products.map((product) => (
                    <div className='column is-one-quarter' key={product.id}>
                        <div className='card'>
                            <div className='card-image'>
                                <figure className='image is-4by3'>
                                    <img
                                        src={product.url}
                                        alt='Product Image'
                                    />
                                </figure>
                            </div>
                            <div className='card-content'>
                                <div className='media'>
                                    <div className='media-content'>
                                        <p className='title is-4'>
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <footer className='card-footer'>
                                <Link to={`/edit/${product.id}`} className='card-footer-item'>Edit</Link>
                                <a onClick={() => deleteProduct(product.id)} className='card-footer-item'>Delete</a>
                            </footer>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
