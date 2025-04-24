import axios from 'axios'
import React from 'react'

export default function useProduct() {

    const getProductById = async(id)=>{
        try {
            const response = await axios.get(`https://xplr.live/api/v1/product/${id}`);
            console.log("response", response.data);
            
            return response.data.data
        } catch (error) {
            console.error("Error fetching product data:", error);
            
        }
    }

  return {getProductById}
}
