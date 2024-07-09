const Genre = require("../models/genre");
var Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// 显示完整的作者列表
exports.genre_list = asyncHandler(async(req,res,next) => {
  const allGenres = await Genre.find().sort({name:1}).exec()
  res.render("genre_list", {
    title: "Genre List",
    list_genres: allGenres,
  });
})

// 为每位作者显示详细信息的页面
// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  // 验证并清理名称字段
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    // .escape() 方法将对数据进行转义，以防止注入攻击，如 XSS（跨站脚本攻击）。它通过将HTML特殊字符（如 <, >, &, ', "）转换为相应的HTML实体，减少恶意脚本的嵌入风险。
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name (case insensitive) already exists.
      // 查找第一个匹配给定查询条件的文档。如果找到匹配的文档，它返回该文档；否则返回 null
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// 由 GET 显示删除作者的表单
exports.genre_delete_get = (req, res) => {
  res.send("未实现：作者删除表单的 GET");
};

// 由 POST 处理作者删除操作
exports.genre_delete_post = (req, res) => {
  res.send("未实现：删除作者的 POST");
};

// 由 GET 显示更新作者的表单
exports.genre_update_get = (req, res) => {
  res.send("未实现：作者更新表单的 GET");
};

// 由 POST 处理作者更新操作
exports.genre_update_post = (req, res) => {
  res.send("未实现：更新作者的 POST");
};
