const express = require("express");
const validate = require("../../../middleware/validate");
const userDto = require("../../../dto/user");
const userController = require("../../../controller/user");
const router = express.Router();

router.post("/", validate(userDto.create), userController.create);
router.get("/", userController.getAll);
router.get("/:userId", userController.get);
router.put("/", validate(userDto.update), userController.update);
router.delete("/:userId", userController.delete);

module.exports = router;

/**
 * @swagger
 * /api/user:
 *      get:
 *          tags:
 *              - User
 *          description: Get User List
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *      post:
 *          tags:
 *              - User
 *          description: Create user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/createUser'
 *      put:
 *          tags:
 *              - User
 *          description: Update user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/editUser'
 * /api/user/{userId}:
 *      get:
 *          tags:
 *              - User
 *          description: Get User Data
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 */
