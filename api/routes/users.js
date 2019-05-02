const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Handling users GET request' 
    });
});
router.get('/:userId',(req, res, next) => {
    const id = req.params.userId;
    if(id === 'special'){
        res.status(200).json({
            message: 'You passed a special ID' ,
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID' ,
            id: id
        });
    }
});

router.post('/',(req, res, next) => {
    const user = {
        name = req.body.name,
        email = req.body.email,
        password = req.body.password
    };
    res.status(201).json({
        message: 'Handling users POST request' ,
        createdUser: user
    });
});

router.patch('/:userId',(req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'Updated User' ,
        id: id
    });
});

router.delete('/:userId',(req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'Deleted User' ,
        id: id
    });
});

module.exports = router;