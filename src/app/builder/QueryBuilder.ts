import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

search(searchableFields: string[]) {
  const searchTerm = this.query?.searchTerm as string;

  if (searchTerm && searchableFields.length > 0) {
    const regex = new RegExp(searchTerm, "i");

    const searchConditions = searchableFields.map(
      (field) =>
        ({
          [field]: { $regex: regex },
        }) as FilterQuery<T>
    );

    this.modelQuery = this.modelQuery.find({ $or: searchConditions });
  }

  return this;
}


  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle price range filtering
    if (queryObj.minPrice || queryObj.maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (queryObj.minPrice) {
        priceFilter.$gte = Number(queryObj.minPrice);
      }
      if (queryObj.maxPrice) {
        priceFilter.$lte = Number(queryObj.maxPrice);
      }
      queryObj.price = priceFilter;
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
