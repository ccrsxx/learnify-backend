import { Op } from 'sequelize';
import { CourseCategory } from '../api/models/index.js';
import * as Types from './types/common.js';
import * as CourseModel from '../api/models/course.js';

/**
 * @param {Types.RequestQuery} params
 * @returns {Promise<Types.WhereOptions<CourseModel.CourseAttributes> | null>}
 */
export async function getCourseFilterQuery(params) {
  /**
   * @type {Partial<{
   *   type: string;
   *   search: string;
   *   filter: string;
   *   category: string;
   *   difficulty: string;
   * }>}
   */
  const { type, filter, category, difficulty, search } = params;

  const hasFilter = type || filter || category || difficulty || search;

  if (!hasFilter) return null;

  /**
   * @type {Partial<{
   *   type: string;
   *   search: string;
   *   filter: string[];
   *   category: string[];
   *   difficulty: string[];
   * }>}
   */
  const queryFilters = {};

  // TODO: handle filter popular and promo, waiting for table user course
  // if (filter) filters.filter = filter.split(',');

  if (type) {
    queryFilters.type = type.trim();
  }

  if (search) {
    queryFilters.search = search.trim();
  }

  if (category) {
    queryFilters.category = category.split(',').flatMap((cat) => {
      const category = cat.trim();
      return category ? category : [];
    });
  }

  if (difficulty) {
    queryFilters.difficulty = difficulty.split(',').flatMap((diff) => {
      const difficulty = diff.trim().toUpperCase();

      const validDifficulty = CourseModel.DIFFICULTY.includes(
        /** @type {CourseModel.Difficulty} */ (difficulty)
      );

      return validDifficulty ? difficulty : [];
    });
  }

  /** @type {Types.WhereOptions<CourseModel.CourseAttributes>} */
  const whereClause = {};

  // TODO: Handle filter popular and promo, waiting for table user course
  // if (queryFilters.filter) ...

  if (queryFilters.type && queryFilters.type !== 'all') {
    if (queryFilters.type === 'free') whereClause.premium = false;
    else if (queryFilters.type === 'premium') whereClause.premium = true;
  }

  if (queryFilters.category?.length) {
    const categories = await CourseCategory.findAll({
      where: { name: queryFilters.category },
      attributes: ['id']
    });

    const categoryIds = categories.map(({ dataValues: { id } }) => id);

    whereClause.course_category_id = categoryIds;
  }

  if (
    queryFilters.difficulty?.length &&
    !queryFilters.difficulty.includes('all')
  ) {
    whereClause.difficulty = queryFilters.difficulty;
  }

  if (queryFilters.search) {
    whereClause.name = {
      [Op.iLike]: `%${queryFilters.search}%`
    };
  }

  return whereClause;
}
