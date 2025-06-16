const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { postSchoolExpensesForm, editSchoolExpense, deleteSchoolExpense, getExpenseRequest, updateExpenseRequest, getAccounts, getAccountsData, addSchoolIncome, editSchoolIncome, getUpdatedSchoolIncomeHistory, createBook, getBooks, issueAndReturnBook, resolveBookRequest, getLibraryData, editLibraryFineAmount, editBook, deleteBook, getNewAdmissions, getAdmissionRequests, createInstantAccount, createStudentAndParent, getStudentsBasedOnClassAndSection, addStudentToExistingParent, addStock, getInventory, saleStockTo, getSaleStock } = require('../controllers/admin.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

// accountant
router.post('/expenses', protect, authorize('authority'), postSchoolExpensesForm);
router.patch('/expenses/:expenseId', protect, authorize('authority'), editSchoolExpense);
router.delete('/expenses/:expenseId', protect, authorize('authority'), deleteSchoolExpense);
router.get('/expenseRequest', protect, authorize('authority'), getExpenseRequest); 
router.patch('/expenseRequest/:requestId', protect, authorize('authority'), updateExpenseRequest); 
router.get('/accounts', protect, authorize('authority'), getAccounts);
router.get('/accountsData', protect, authorize('authority'), getAccountsData);
router.post('/income', protect, authorize('authority'), addSchoolIncome);
router.post('/income/:id', protect, authorize('authority'), editSchoolIncome);
router.get('/updatedIncomeHistory/:id', protect, authorize('authority'), getUpdatedSchoolIncomeHistory);


// librarian
router.post('/createBook', protect, authorize('authority'), upload.single('photo'), createBook);
router.get('/books', protect, authorize('authority'), getBooks);
router.patch('/bookRequest/:requestId', protect, authorize('authority'), issueAndReturnBook);
router.patch('/resolveBookRequest/:requestId', protect, authorize('authority'), resolveBookRequest);
router.get('/library', protect, authorize('authority'), getLibraryData);
router.patch('/fineAmount', protect, authorize('authority'), editLibraryFineAmount);
router.patch('/book/:id', protect, authorize('authority'), upload.single('photo'), editBook);
router.delete('/book/:bookId', protect, authorize('authority'), deleteBook);


// admissions manager
router.get('/newAdmission', protect, authorize('authority'), getNewAdmissions);
router.get('/admission', protect, authorize('authority'), getAdmissionRequests);
router.post('/admission/:id', protect, authorize('authority'), createInstantAccount);
router.post('/registersp', protect, authorize('authority'), upload.single('photo'), createStudentAndParent);
router.get('/students/:className/:section', protect, authorize('authority'), getStudentsBasedOnClassAndSection);
router.post('/addStudent', protect, authorize('authority'),upload.single('photo'), addStudentToExistingParent);


// inventory clerk
router.post('/inventory/add', protect, authorize('authority'), addStock);
router.get('/inventory', protect, authorize('authority'), getInventory);
router.post('/inventory/sale', protect, authorize('authority'), saleStockTo);
router.get('/inventory/sale', protect, authorize('authority'), getSaleStock);


module.exports = router;
