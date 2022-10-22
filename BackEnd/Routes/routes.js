const express = require( 'express' );
const app = new express();
const router = express.Router();
const controller = require("../Controller/controller")

router.post( '/userLogin', controller.userLogin );
router.post( '/addUser', controller.addUser );
router.get( '/userData', controller.userData );
router.delete( '/deleteUser/:id', controller.deleteUser );
router.get( '/viewUser/:id', controller.viewUser );
router.put( '/updateUserDetails/:id', controller.editUser );


module.exports = router;