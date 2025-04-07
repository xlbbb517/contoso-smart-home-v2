namespace ContosoOutdoors.Admin;

using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public static class ProductsFunction
{
    private static DataStorage _dataStorage;

    public ProductsFunction(DataStorage dataStorage)
    {
        _dataStorage = dataStorage;
    }

    [FunctionName("GetProducts")]
    public static async Task<IActionResult> GetProducts(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request to get products.");
        var products = _dataStorage.GetAllProducts();
        return new OkObjectResult(products);
    }

    [FunctionName("UpdateProduct")]
    public static async Task<IActionResult> UpdateProduct(
        [HttpTrigger(AuthorizationLevel.Function, "post", "put", Route = null)] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request to update a product.");
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var updatedProduct = JsonConvert.DeserializeObject<DataStorage.Product>(requestBody);
        _dataStorage.AddOrUpdateProduct(updatedProduct);
        return new OkObjectResult(updatedProduct);
    }
}
