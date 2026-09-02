/**
 * 初始数据库结构迁移
 *
 * 这个文件定义了 PocketBase 的初始数据结构。
 * 在部署时，PocketBase 会自动执行这个迁移文件来创建集合和字段。
 *
 * 使用说明：
 * 1. 在本地开发环境中，通过管理界面创建好所有集合和字段
 * 2. 使用 PocketBase CLI 导出迁移：`pocketbase migrate create`
 * 3. 或者手动编写迁移文件（参考此示例）
 *
 * 迁移文件命名规则：{timestamp}_{description}.js
 * 例如：1728201600_initial.js
 */

/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
migrate(
  (db) => {
    // 示例：创建一个用户集合
    // 你可以根据实际需求修改或添加更多集合
    // const dao = new Dao(db);
    // const collection = new Collection({
    //   "id": "users",
    //   "name": "users",
    //   "type": "base",
    //   "system": false,
    //   "schema": [
    //     {
    //       "id": "name",
    //       "name": "name",
    //       "type": "text",
    //       "required": true,
    //       "presentable": false,
    //       "unique": false,
    //       "options": {
    //         "min": null,
    //         "max": null,
    //         "pattern": ""
    //       }
    //     },
    //     {
    //       "id": "email",
    //       "name": "email",
    //       "type": "email",
    //       "required": true,
    //       "presentable": false,
    //       "unique": true,
    //       "options": {
    //         "exceptDomains": null,
    //         "onlyDomains": null
    //       }
    //     }
    //   ],
    //   "indexes": [],
    //   "listRule": null,
    //   "viewRule": null,
    //   "createRule": null,
    //   "updateRule": null,
    //   "deleteRule": null,
    //   "options": {}
    // });
    // return dao.saveCollection(collection);
    // 当前为空迁移，你可以取消注释上面的代码并修改为你的实际需求
    // 或者使用 PocketBase CLI 自动生成迁移文件
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  },
  (db) => {
    // 回滚逻辑（可选）
    // const dao = new Dao(db);
    // const collection = dao.findCollectionByNameOrId("users");
    // return dao.deleteCollection(collection);
  }
)
