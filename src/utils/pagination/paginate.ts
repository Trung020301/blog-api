import { Model } from 'mongoose';

export class Paginator {
  model: Model<any>;
  filter: any;
  options: {
    page: number;
    limit: number;
    sort?: any;
    select?: any;
    populate?: any;
  };

  constructor(
    model: Model<any>,
    filter: any,
    options: {
      page: number;
      limit: number;
      sort?: any;
      select?: any;
      populate?: any;
    },
  ) {
    this.model = model;
    this.filter = filter;
    this.options = options;
  }

  async paginate() {
    const { page, limit, sort, select, populate } = this.options;
    const skip = (page - 1) * limit;

    const query = this.model.find(this.filter).skip(skip).limit(limit);

    if (sort) query.sort(sort);
    if (select) query.select(select);
    if (populate) query.populate(populate);

    const [docs, totalDocs] = await Promise.all([
      query.exec(),
      this.model.countDocuments(this.filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);
    const prevPage = page - 1 > 0 ? page - 1 : null;
    const nextPage = page + 1 <= totalPages ? page + 1 : null;
    const pagingCounter = skip + 1;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }
}
