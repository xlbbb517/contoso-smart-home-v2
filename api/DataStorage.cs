namespace ContosoOutdoors.Admin;

using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

public class DataStorage
{
    private List<Product> products = new List<Product>();

    public DataStorage()
    {
        LoadProductsFromJson();
    }

    private void LoadProductsFromJson()
    {
        var productsJson = File.ReadAllText("api/products.json");
        products = JsonConvert.DeserializeObject<List<Product>>(productsJson) ?? new List<Product>();
    }

    public IEnumerable<Product> GetAllProducts()
    {
        return products;
    }

    public void AddOrUpdateProduct(Product product)
    {
        var existingProduct = products.Find(p => p.Id == product.Id);
        if (existingProduct != null)
        {
            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
        }
        else
        {
            products.Add(product);
        }
    }
}


