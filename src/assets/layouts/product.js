export const productJSON = {
  "card": {
    "log_id": "div2_sample_card",
    "states": [
      {
        "state_id": 0,
        "div": {
          "orientation": "vertical",
          "type": "container",
          "background": [
            {
              "type": "solid",
              "color": "#FFFFFF"
            }
          ],
          "items": [
            {
              "type": "pager",
              "layout_mode": {
                "type": "percentage",
                "page_width": {
                  "type": "percentage",
                  "value": 100
                }
              },
              "id": "image_pager",
              "height": {
                "type": "fixed",
                "value": 350
              },
              "item_builder": {
                "data": "@{product.getArray('images')}",
                "data_element_name": "item",
                "prototypes": [
                  {
                    "div": {
                      "type": "image",
                      "image_url": "@{item.getString('url')}",
                      "width": {
                        "type": "match_parent"
                      },
                      "height": {
                        "type": "match_parent"
                      },
                      "scale": "fit",
                      "border": {
                        "corner_radius": 8
                      },
                      "margins": {
                        "left": 16,
                        "right": 16,
                        "top": 8
                      }
                    }
                  }
                ]
              }
            },
            {
              "type": "indicator",
              "pager_id": "image_pager",
              "height": {
                "type": "fixed",
                "value": 15
              },
              "margins": {
                "top": 12
              }
            },
            {
              "type": "container",
              "margins": {
                "left": 16,
                "right": 16,
                "top": 24
              },
              "items": [
                {
                  "type": "text",
                  "text": "@{product.getString('name')}",
                  "font_size": 24,
                  "font_weight": "bold",
                  "text_color": "#1A1A1A"
                },
                {
                  "type": "container",
                  "orientation": "horizontal",
                  "margins": {
                    "top": 8
                  },
                  "items": [
                    {
                      "type": "text",
                      "text": "@{product.getString('vendor')}",
                      "font_size": 16,
                      "text_color": "#666666"
                    }
                  ]
                },
                {
                  "type": "container",
                  "orientation": "horizontal",
                  "margins": {
                    "top": 16
                  },
                  "items": [
                    {
                      "type": "text",
                      "text": "₹@{product.getArray('ProductVariants').getDict(0).getString('price')}",
                      "font_size": 22,
                      "font_weight": "bold",
                      "text_color": "#FF3E3E"
                    },
                    {
                      "type": "text",
                      "text": "₹@{product.getArray('ProductVariants').getDict(0).getString('compare_at_price')}",
                      "font_size": 16,
                      "text_color": "#999999",
                      "margins": {
                        "left": 8
                      },
                     "strike": "single"
                    }
                  ]
                },
                {
                  "type": "text",
                  "text": "In Stock: @{product.getArray('ProductVariants').getDict(0).getArray('Inventories').getDict(0).getNumber('quantity')}",
                  "font_size": 14,
                  "text_color": "#4CAF50",
                  "margins": {
                    "top": 8
                  }
                }
              ]
            },
            {
              "type": "container",
              "orientation": "vertical",
              "margins": {
                "left": 16,
                "right": 16,
                "top": 16
              },
              "items": [
                {
                  "type": "text",
                  "text": "Available Variants",
                  "font_size": 18,
                  "font_weight": "medium",
                  "margins": {
                    "bottom": 8
                  }
                },
                {
                  "type": "container",
                  "orientation": "horizontal",
                  "scroll_mode": "horizontal",
                  "height": {
                    "type": "fixed",
                    "value": 40
                  },
                  "item_builder": {
                    "data": "@{product.getArray('ProductVariants')}",
                    "data_element_name": "variant",
                    "prototypes": [
                      {
                        "div": {
                          "type": "container",
                          "border": {
                            "corner_radius": 8,
                            "stroke": {
                              "color": "#DDDDDD",
                              "width": 1
                            }
                          },
                          "margins": {
                            "right": 8
                          },
                          "paddings": {
                            "left": 12,
                            "right": 12,
                            "top": 8,
                            "bottom": 8
                          },
                          "items": [
                            {
                              "type": "container",
                              "orientation": "horizontal",
                              "items": [
                                {
                                  "type": "text",
                                  "text": "₹@{variant.getString('price')}",
                                  "font_size": 14,
                                  "font_weight": "bold"
                                },
                                {
                                  "type": "text",
                                  "text": "₹@{variant.getString('compare_at_price')}",
                                  "font_size": 12,
                                  "text_color": "#999999",
                                  "margins": {
                                    "left": 4
                                  },
                                  "strikethrough": true,
                                  "visibility": {
                                    "condition": "@{variant.hasKey('compare_at_price') && variant.getString('compare_at_price') != ''}"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            {
              "type": "container",
              "margins": {
                "top": 24,
                "left": 16,
                "right": 16
              },
              "items": [
                {
                  "type": "text",
                  "text": "Description",
                  "font_size": 18,
                  "font_weight": "medium"
                },
                {
                  "type": "text",
                  "text": "@{product.getString('description')}",
                  "font_size": 16,
                  "line_height": 24,
                  "text_color": "#666666",
                  "margins": {
                    "top": 12
                  }
                }
              ]
            },
            {
              "type": "container",
              "height": {
                "type": "fixed",
                "value": 80
              },
              "background": [
                {
                  "type": "solid",
                  "color": "#FFFFFF"
                }
              ],
              "margins": {
                "top": 24
              },
              "items": [
                {
                  "text": "Buy now",
                  "animation_action": "none",
                  "text_color": "#ffffff",
                  "background": [
                    {
                      "type": "solid",
                      "color": "#000"
                    }
                  ],
                  "type": "_template_payment_gateway",
                  "width": {
                    "type": "match_parent"
                  },
                  "actions": [
                    {
                      "log_id": "action_id",
                      "url": "xplore-promote://paymentGateway?productId=@{product.getString('id')}&variantId=@{product.getArray('ProductVariants').getDict(0).getString('id')}",
                      "service": "38695482-2a45-48fc-9331-365fae5015f0",
                      "log_url": "xplore-cashfree"
                    }
                  ],
                  "margins": {
                    "right": 10,
                    "left": 10
                  },
                  "border": {
                    "corner_radius": 8
                  }
                }
              ]
            }
          ]
        }
      }
    ],
    "variables": [
      {
        "type": "dict",
        "name": "local_palette",
        "value": {
          "bg_primary": {
            "name": "Primary background",
            "light": "#fff",
            "dark": "#000"
          },
          "color0": {
            "name": "Secondary background",
            "light": "#eeeeee",
            "dark": "#000"
          }
        }
      },
      {
        "type": "dict",
        "name": "product",
        "value": {
          "id": "3d04e784-c51e-4c51-af46-f6514f9d2f83",
          "name": "Men's Cotton T-Shirt",
          "description": "Premium 100% cotton crewneck t-shirt. Machine washable. Available in multiple sizes and colors.",
          "images": [
              {
                  "url": "https://xplore.objectstore.e2enetworks.net/1744714087547-516cdcd6e895c52d.jpg",
                  "filename": "1744714087547-516cdcd6e895c52d.jpg",
                  "originalName": "01887420752-e3.jpg",
                  "size": 45577,
                  "mimetype": "image/jpeg",
                  "cdnEnabled": true
              },
              {
                  "url": "https://xplore.objectstore.e2enetworks.net/1744714087569-05576ac872afdf3e.jpg",
                  "filename": "1744714087569-05576ac872afdf3e.jpg",
                  "originalName": "01887420752-a2.jpg",
                  "size": 43058,
                  "mimetype": "image/jpeg",
                  "cdnEnabled": true
              },
              {
                  "url": "https://xplore.objectstore.e2enetworks.net/1744714087550-07013e6787653acf.jpg",
                  "filename": "1744714087550-07013e6787653acf.jpg",
                  "originalName": "01887420752-p.jpg",
                  "size": 63516,
                  "mimetype": "image/jpeg",
                  "cdnEnabled": true
              },
              {
                  "url": "https://xplore.objectstore.e2enetworks.net/1744714087574-37e85db269e62c34.jpg",
                  "filename": "1744714087574-37e85db269e62c34.jpg",
                  "originalName": "01887420752-e1.jpg",
                  "size": 13432,
                  "mimetype": "image/jpeg",
                  "cdnEnabled": true
              },
              {
                  "url": "https://xplore.objectstore.e2enetworks.net/1744714087551-a56808b2e76f024f.jpg",
                  "filename": "1744714087551-a56808b2e76f024f.jpg",
                  "originalName": "01887420752-e2.jpg",
                  "size": 11955,
                  "mimetype": "image/jpeg",
                  "cdnEnabled": true
              }
          ],
          "type": "physical",
          "vendor": "FashionHub Apparel",
          "seo_title": "Men's Cotton T-Shirt | Comfortable Everyday Wear",
          "seo_description": "Shop high-quality men's cotton t-shirts in various colors and sizes. Perfect for casual wear.",
          "status": "active",
          "createdAt": "2025-04-15T10:48:07.653Z",
          "updatedAt": "2025-04-15T10:48:07.653Z",
          "Collections": [
              {
                  "id": "3f56117c-06af-4af4-a60e-c4a4404bc29d",
                  "name": "Summer Collection",
                  "image": null,
                  "description": "Fresh arrivals on summer",
                  "seo_title": "Summer Fashion",
                  "seo_description": "Explore Summer fashion",
                  "is_active": true,
                  "createdAt": "2025-04-11T04:16:28.567Z",
                  "updatedAt": "2025-04-11T04:16:28.567Z",
                  "user_id": "be458fc0-f404-4ba3-8191-bd529876e88f"
              }
          ],
          "Tags": [
              {
                  "id": "bc12157f-ab3c-41df-a96d-c9c03e003eff",
                  "name": "Summer Collection",
                  "createdAt": "2025-04-15T10:48:07.665Z",
                  "updatedAt": "2025-04-15T10:48:07.665Z"
              },
              {
                  "id": "48e39af1-2f41-4ef2-9ce0-a3dfb96f5877",
                  "name": "Best Seller",
                  "createdAt": "2025-04-15T10:48:07.670Z",
                  "updatedAt": "2025-04-15T10:48:07.670Z"
              }
          ],
          "ProductVariants": [
              {
                  "id": "9bdd9805-122d-469c-abf5-a69d42e2fab5",
                  "images": [],
                  "barcode": "123456789012",
                  "price": "29.99",
                  "compare_at_price": "39.99",
                  "weight": "0.30",
                  "weight_unit": "kg",
                  "requires_shipping": true,
                  "is_taxable": true,
                  "is_active": true,
                  "createdAt": "2025-04-15T10:48:07.672Z",
                  "updatedAt": "2025-04-15T10:48:07.672Z",
                  "product_id": "3d04e784-c51e-4c51-af46-f6514f9d2f83",
                  "Inventories": [
                      {
                          "id": "72c924d5-a936-4191-8264-2530c04de22b",
                          "reservedQuantity": 0,
                          "quantity": 50,
                          "createdAt": "2025-04-15T10:48:07.677Z",
                          "updatedAt": "2025-04-15T10:48:07.677Z",
                          "variant_id": "9bdd9805-122d-469c-abf5-a69d42e2fab5",
                          "location_id": "d89536a3-ac95-433e-9988-5c52daabb2b6",
                          "InventoryLocation": {
                              "id": "d89536a3-ac95-433e-9988-5c52daabb2b6",
                              "name": "Main Warehouse",
                              "address": "456 Commerce Street, Toronto, Canada",
                              "pincode": null,
                              "city": null,
                              "state": null,
                              "country": "India",
                              "phone": null,
                              "is_active": true,
                              "createdAt": "2025-04-15T10:48:07.675Z",
                              "updatedAt": "2025-04-15T10:48:07.675Z"
                          }
                      }
                  ]
              },
              {
                  "id": "1be998b6-2149-4d06-93c7-708320844e12",
                  "images": [],
                  "barcode": "234567890123",
                  "price": "29.99",
                  "compare_at_price": "39.99",
                  "weight": "0.30",
                  "weight_unit": "kg",
                  "requires_shipping": true,
                  "is_taxable": true,
                  "is_active": true,
                  "createdAt": "2025-04-15T10:48:07.679Z",
                  "updatedAt": "2025-04-15T10:48:07.679Z",
                  "product_id": "3d04e784-c51e-4c51-af46-f6514f9d2f83",
                  "Inventories": [
                      {
                          "id": "49191d6d-aa22-4613-9c54-6700785307b1",
                          "reservedQuantity": 0,
                          "quantity": 75,
                          "createdAt": "2025-04-15T10:48:07.681Z",
                          "updatedAt": "2025-04-15T10:48:07.681Z",
                          "variant_id": "1be998b6-2149-4d06-93c7-708320844e12",
                          "location_id": "3999d50b-41ac-43ab-ba58-221a73b4e2a2",
                          "InventoryLocation": {
                              "id": "3999d50b-41ac-43ab-ba58-221a73b4e2a2",
                              "name": "West Distribution Center",
                              "address": "789 Industrial Ave, Vancouver, Canada",
                              "pincode": null,
                              "city": null,
                              "state": null,
                              "country": "India",
                              "phone": null,
                              "is_active": true,
                              "createdAt": "2025-04-15T10:48:07.680Z",
                              "updatedAt": "2025-04-15T10:48:07.680Z"
                          }
                      }
                  ]
              }
          ]
      }
      }
    ]
  },
  "templates": {
    "_template_payment_gateway": {
      "type": "text",
      "text_alignment_horizontal": "center",
      "text_alignment_vertical": "center",
      "border": {
        "$corner_radius": "corners"
      },
      "paddings": {
        "bottom": 18,
        "left": 18,
        "right": 18,
        "top": 18
      },
      "width": {
        "type": "wrap_content"
      }
    }
  }
}


  export const productOne =  {
    "id": "prod_001",
    "title": "Premium Cotton T-Shirt",
    "description": "Soft 100% organic cotton crew neck t-shirt with double-stitched seams.",
    "vendor": "EcoWear",
    "product_type": "Apparel",
    "price": "24.99",
    "compare_at_price": "34.99",
    "images": [
        {"src": "https://m.media-amazon.com/images/I/61pgZ-+We6L._SY741_.jpg"},
        {"src": "https://m.media-amazon.com/images/I/61tqm2M9v2L._SY741_.jpg"},
        {"src": "https://images.pexels.com/photos/47547/squirrel-animal-cute-rodents-47547.jpeg?auto=compress&cs=tinysrgb&w=600"},
      
    ],
    "variants": [
      {"title": "Small", "price": "24.99"},
      {"title": "Medium", "price": "24.99"},
      {"title": "Large", "price": "24.99"}
    ]
  }

  export const productTwo =  {
    "id": "prod_002",
    "title": "Smart Fitness Tracker",
    "description": "Waterproof activity tracker with heart rate monitoring and GPS.",
    "vendor": "TechGear",
    "product_type": "Electronics",
    "price": "89.99",
    "images": [
        {
            "src": "https://m.media-amazon.com/images/I/61Bugm3Wo+L._SY450_.jpg"
          },
          {
            "src": "https://m.media-amazon.com/images/I/718BT2-13yL._SL1500_.jpg"
          }
    ],
    "variants": [
      {"title": "Black", "price": "89.99"},
      {"title": "Silver", "price": "89.99"}
    ]
  }