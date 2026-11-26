// Services layer: business logic and data. Plain TypeScript — it never
// imports Express nor touches req/res/next, so it can be tested without HTTP.
import { randomUUID } from 'node:crypto';
// The in-memory array now lives here, not in the routes.
const articles = [];
export function list(page, limit) {
    const start = (page - 1) * limit;
    return {
        data: articles.slice(start, start + limit),
        pagination: { page, limit, total: articles.length },
    };
}
export function getById(id) {
    return articles.find((article) => article.id === id);
}
export function create(title, description) {
    const article = {
        id: randomUUID(),
        title,
        description,
        createdAt: new Date().toISOString(),
    };
    articles.push(article);
    return article;
}
export function update(id, changes) {
    const article = getById(id);
    if (!article) {
        return undefined;
    }
    if (changes.title !== undefined) {
        article.title = changes.title;
    }
    if (changes.description !== undefined) {
        article.description = changes.description;
    }
    return article;
}
//# sourceMappingURL=articlesService.js.map