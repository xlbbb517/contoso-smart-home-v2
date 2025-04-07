namespace ContosoOutdoors.Admin;
using Rating = decimal;

public class Product(int id, string name, string description, decimal price, 
                        Review[] reviews, string supplierReference)
{
    public Product(int id, string name, string description, decimal price, 
                        Review[] reviews, string supplierReference) : 
        this(id, name, description, price, [], supplierReference) { }

    public int Id => id;
    public string Name { get; init; } = name;
    public string Description { get; init; } = description;
    public decimal Price { get; init; } = price;
    public Review[] Reviews { get; init; } = reviews;
    public string SupplierReference { get; init; } = supplierReference;

    public string ParseSupplierReference() => 
        System.Text.RegularExpressions.Regex.IsMatch(SupplierReference, @"^[A-Z]{3}\d{10}[A-Z]{2}$") 
        ? SupplierReference 
        : throw new FormatException("Supplier reference format is invalid.");

}

public class Review 
{
    public Rating Rating { get; init; }
 
    public string Comment { get; init; }
}