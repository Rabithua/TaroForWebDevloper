# PocketBase Migrations

这个目录包含 PocketBase 的数据库迁移文件。

## 什么是 Migrations？

Migrations 是数据库结构变更的版本控制系统。通过迁移文件，你可以：

- 在代码仓库中管理数据库结构
- 确保开发、测试、生产环境的一致性
- 自动初始化新部署的数据库

## 文件命名规则

迁移文件必须遵循以下命名格式：

```
{timestamp}_{description}.js
```

例如：

- `1728201600_initial.js` - 初始数据库结构
- `1728201700_add_user_fields.js` - 添加用户字段
- `1728201800_create_posts_collection.js` - 创建文章集合

**时间戳**：使用 Unix 时间戳（秒），确保文件按时间顺序执行。

## 如何创建迁移文件

### 方法 1：使用 PocketBase CLI（推荐）

1. 启动 PocketBase 服务
2. 通过管理界面创建集合和字段
3. 使用 CLI 导出迁移：

```bash
# 进入容器
docker exec -it pocketbase sh

# 创建迁移（PocketBase 会自动检测变更）
/pb/pocketbase migrate create
```

### 方法 2：手动编写

参考 `1728201600_initial.js` 示例文件，手动编写迁移逻辑。

## 迁移文件结构

```javascript
migrate(
  (db) => {
    // 执行迁移（创建/修改结构）
    const dao = new Dao(db)
    const collection = new Collection({
      id: 'collection_id',
      name: 'collection_name',
      type: 'base',
      schema: [
        // 字段定义
      ],
    })
    return dao.saveCollection(collection)
  },
  (db) => {
    // 回滚逻辑（可选）
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId('collection_id')
    return dao.deleteCollection(collection)
  }
)
```

## 执行顺序

- PocketBase 会按照文件名的时间戳顺序执行迁移
- 每个迁移只会执行一次（PocketBase 会记录已执行的迁移）
- 如果迁移失败，PocketBase 会停止并报告错误

## 部署流程

1. **本地开发**：通过管理界面创建集合和字段
2. **创建迁移**：使用 CLI 或手动创建迁移文件
3. **提交代码**：将迁移文件提交到 Git
4. **部署**：Docker 构建时会自动将迁移文件打包到镜像
5. **自动执行**：容器启动时，PocketBase 会自动执行所有未执行的迁移

## 注意事项

- ⚠️ 迁移文件一旦执行，不要随意修改（除非是新迁移）
- ✅ 新增结构变更时，创建新的迁移文件
- ✅ 迁移文件应该只包含结构定义，不包含数据
- ✅ 测试迁移文件后再提交到代码仓库

## 更多信息

参考 [PocketBase 官方文档](https://pocketbase.io/docs/) 了解更多关于 migrations 的详细信息。
