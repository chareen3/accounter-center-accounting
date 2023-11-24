-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 02, 2022 at 10:21 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_areas`
--

CREATE TABLE `tbl_areas` (
  `area_id` int(11) NOT NULL,
  `area_name` varchar(255) NOT NULL,
  `area_created_isodt` varchar(30) DEFAULT NULL,
  `area_updated_isodt` varchar(30) DEFAULT NULL,
  `area_created_by` int(11) NOT NULL DEFAULT 0,
  `area_updated_by` int(11) NOT NULL DEFAULT 0,
  `area_status` enum('active','deactivated','deleted') NOT NULL DEFAULT 'active',
  `area_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_areas`
--

INSERT INTO `tbl_areas` (`area_id`, `area_name`, `area_created_isodt`, `area_updated_isodt`, `area_created_by`, `area_updated_by`, `area_status`, `area_branch_id`) VALUES
(3124, 'Babuchara', NULL, NULL, 0, 0, 'active', 1),
(3125, 'Baghaihat Bazar', NULL, NULL, 0, 0, 'active', 1),
(3126, 'Betchari', NULL, NULL, 0, 0, 'active', 1),
(3127, 'Bhai Bon Chara', NULL, NULL, 0, 0, 'active', 1),
(3128, 'Boalkhali Bazar', NULL, NULL, 0, 0, 'active', 1),
(3129, 'Boalkhali Bazar RT Sales', NULL, NULL, 0, 0, 'active', 1),
(3130, 'Choto Marung', NULL, NULL, 0, 0, 'active', 1),
(3131, 'Guimara', NULL, NULL, 0, 0, 'active', 1),
(3132, 'Jaliapara', NULL, NULL, 0, 0, 'active', 1),
(3133, 'Kabakali', NULL, NULL, 0, 0, 'active', 1),
(3134, 'Khagrachari Shadar', NULL, NULL, 0, 0, 'active', 1),
(3135, 'Korengatoli', NULL, NULL, 0, 0, 'active', 1),
(3136, 'Langadu', NULL, NULL, 0, 0, 'active', 1),
(3137, 'Machalong', NULL, NULL, 0, 0, 'active', 1),
(3138, 'Madhy Boalkhali', NULL, NULL, 0, 0, 'active', 1),
(3139, 'Maini Bazar', NULL, NULL, 0, 0, 'active', 1),
(3140, 'Maischari', NULL, NULL, 0, 0, 'active', 1),
(3141, 'Manik Chari', NULL, NULL, 0, 0, 'active', 1),
(3142, 'Marissa', NULL, NULL, 0, 0, 'active', 1),
(3143, 'Matiranga', NULL, NULL, 0, 0, 'active', 1),
(3144, 'Mohalchari', NULL, NULL, 0, 0, 'active', 1),
(3145, 'Panchari, Khagrachari', NULL, NULL, 0, 0, 'active', 1),
(3146, 'Thana Bazar', NULL, NULL, 0, 0, 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bank_accounts`
--

CREATE TABLE `tbl_bank_accounts` (
  `bank_acc_id` int(11) NOT NULL,
  `bank_acc_code` varchar(30) NOT NULL,
  `bank_acc_name` varchar(255) DEFAULT NULL,
  `bank_acc_number` varchar(30) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_acc_init_balance` double DEFAULT NULL,
  `bank_acc_branch` varchar(255) DEFAULT NULL,
  `bank_acc_note` text DEFAULT NULL,
  `bank_acc_type` varchar(255) DEFAULT NULL,
  `bank_acc_created_isodt` varchar(30) NOT NULL,
  `bank_acc_updated_isodt` varchar(30) DEFAULT NULL,
  `bank_acc_created_by` int(11) NOT NULL DEFAULT 0,
  `bank_acc_updated_by` int(11) DEFAULT 0,
  `bank_acc_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active',
  `bank_acc_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_bank_accounts`
--

INSERT INTO `tbl_bank_accounts` (`bank_acc_id`, `bank_acc_code`, `bank_acc_name`, `bank_acc_number`, `bank_name`, `bank_acc_init_balance`, `bank_acc_branch`, `bank_acc_note`, `bank_acc_type`, `bank_acc_created_isodt`, `bank_acc_updated_isodt`, `bank_acc_created_by`, `bank_acc_updated_by`, `bank_acc_status`, `bank_acc_branch_id`) VALUES
(1, 'BA00001', 'SoftTask DBL', '238.151.92844', 'Dutch-Bangla Bank', 30000, 'Mirpur', '', 'Savings', '2021-02-20T12:37:04.250Z', '2021-02-21T19:58:22.687Z', 57, 57, 'active', 1),
(2, 'BA00002', 'SoftTask EBL', '5460.0842.0008.0964', 'Eastern Bank', 20000, 'Mirpur', '', 'Savings', '2021-02-20T12:40:36.191Z', '2021-02-21T19:58:38.067Z', 57, 57, 'active', 1),
(3, 'BA00003', 'SoftTask', '000.1111.2222.3333', 'Islami Bank Ltd', 10000, 'Dhanmondi', '', 'Savings', '2021-02-20T12:42:30.259Z', '2021-02-21T19:59:07.856Z', 57, 57, 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bank_transactions`
--

CREATE TABLE `tbl_bank_transactions` (
  `bank_tran_id` int(11) NOT NULL,
  `bank_tran_code` varchar(30) NOT NULL,
  `bank_tran_acc_id` int(11) NOT NULL,
  `bank_tran_type` enum('deposit','withdraw') NOT NULL,
  `bank_tran_in_amount` double NOT NULL DEFAULT 0,
  `bank_tran_out_amount` double NOT NULL DEFAULT 0,
  `bank_tran_created_isodt` varchar(30) NOT NULL,
  `bank_tran_updated_isodt` varchar(30) DEFAULT NULL,
  `bank_tran_created_by` int(11) NOT NULL,
  `bank_tran_updated_by` int(11) NOT NULL DEFAULT 0,
  `bank_tran_branch_id` int(11) NOT NULL,
  `bank_tran_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active',
  `bank_tran_note` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_bank_transactions`
--

INSERT INTO `tbl_bank_transactions` (`bank_tran_id`, `bank_tran_code`, `bank_tran_acc_id`, `bank_tran_type`, `bank_tran_in_amount`, `bank_tran_out_amount`, `bank_tran_created_isodt`, `bank_tran_updated_isodt`, `bank_tran_created_by`, `bank_tran_updated_by`, `bank_tran_branch_id`, `bank_tran_status`, `bank_tran_note`) VALUES
(1, 'CT00001', 2, 'deposit', 20000, 0, '2021-02-20T17:57:55.783Z', NULL, 57, 0, 1, 'active', ''),
(2, 'CT00002', 2, 'withdraw', 0, 5000, '2021-02-20T17:58:10.544Z', NULL, 57, 0, 1, 'active', ''),
(3, 'CT00003', 1, 'deposit', 10000, 0, '2021-02-20T17:58:23.873Z', NULL, 57, 0, 1, 'active', ''),
(4, 'CT00004', 3, 'withdraw', 0, 2000, '2021-02-20T17:58:36.071Z', NULL, 57, 0, 1, 'active', ''),
(5, 'CT00005', 2, 'withdraw', 0, 3000, '2021-02-20T17:58:43.355Z', NULL, 57, 0, 1, 'active', ''),
(6, 'CT00006', 2, 'deposit', 12000, 0, '2021-02-20T17:58:50.680Z', NULL, 57, 0, 1, 'active', ''),
(7, 'CT00007', 1, 'deposit', 7000, 0, '2021-02-20T17:59:00.607Z', NULL, 57, 0, 1, 'active', ''),
(8, 'CT00008', 3, 'deposit', 20000, 0, '2021-02-20T17:59:15.409Z', NULL, 57, 0, 1, 'active', ''),
(9, 'CT00009', 1, 'withdraw', 0, 2000, '2021-02-20T17:59:26.003Z', NULL, 57, 0, 1, 'active', ''),
(10, 'CT000010', 2, 'withdraw', 0, 4000, '2021-02-20T17:59:37.093Z', NULL, 57, 0, 1, 'active', '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_branches`
--

CREATE TABLE `tbl_branches` (
  `branch_id` int(11) NOT NULL,
  `branch_name` varchar(255) NOT NULL,
  `branch_title` text NOT NULL,
  `branch_address` text NOT NULL,
  `branch_created_isodt` varchar(30) DEFAULT NULL,
  `branch_updated_isodt` varchar(30) DEFAULT NULL,
  `branch_created_by` int(11) NOT NULL DEFAULT 0,
  `branch_updated_by` int(11) NOT NULL DEFAULT 0,
  `branch_status` enum('active','deactivated','pending') DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_branches`
--

INSERT INTO `tbl_branches` (`branch_id`, `branch_name`, `branch_title`, `branch_address`, `branch_created_isodt`, `branch_updated_isodt`, `branch_created_by`, `branch_updated_by`, `branch_status`) VALUES
(1, 'Soft Task-Main Branch', 'Software Task', 'Dhaka\n', '2021-01-09T19:03:34.751Z', '2021-02-20T18:54:50.060Z', 57, 57, 'active'),
(7, 'Soft Task - Dinajpur Branch', 'Soft Task - Dinajpur Branch', 'Dinajpur,Rangpur', '2021-02-20T19:13:37.765Z', NULL, 57, 57, 'active'),
(6, 'Soft Task - Rangpur Branch', 'Soft Task  Rangpur Branch', 'Rangpur', '2021-02-20T19:12:51.206Z', NULL, 57, 57, 'active'),
(8, 'Test', 'Test', 'Dhaka', '2022-02-13T05:59:57.576Z', NULL, 57, 57, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cash_deposit_withdraw_trans`
--

CREATE TABLE `tbl_cash_deposit_withdraw_trans` (
  `tran_id` int(11) NOT NULL,
  `tran_code` varchar(100) NOT NULL,
  `tran_type` enum('deposit','withdraw') NOT NULL,
  `tran_amount` double NOT NULL,
  `tran_created_isodt` varchar(30) NOT NULL,
  `tran_note` text DEFAULT NULL,
  `tran_user_id` int(11) NOT NULL,
  `tran_branch_id` int(11) NOT NULL,
  `tran_status` enum('a','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_cash_deposit_withdraw_trans`
--

INSERT INTO `tbl_cash_deposit_withdraw_trans` (`tran_id`, `tran_code`, `tran_type`, `tran_amount`, `tran_created_isodt`, `tran_note`, `tran_user_id`, `tran_branch_id`, `tran_status`) VALUES
(16, 'CDW00001', 'deposit', 100000, '2021-10-26T07:24:31.323Z', '', 57, 1, 'a'),
(17, 'CDW000017', 'deposit', 20000, '2021-10-26T07:25:31.589Z', '', 57, 1, 'a'),
(18, 'CDW000018', 'deposit', 5000, '2021-10-26T07:30:32.711Z', '', 57, 1, 'a'),
(19, 'CDW000019', 'deposit', 100000, '2022-02-13T06:03:23.717Z', '', 57, 8, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cash_transactions`
--

CREATE TABLE `tbl_cash_transactions` (
  `cash_tran_id` int(11) NOT NULL,
  `cash_tran_code` varchar(30) NOT NULL,
  `bank_acc_id` int(11) NOT NULL DEFAULT 0,
  `cash_tran_method` enum('cash','bank') NOT NULL DEFAULT 'cash',
  `cash_tran_type` enum('payment','receive') NOT NULL,
  `cash_tran_acc_id` int(11) NOT NULL,
  `cash_tran_note` text NOT NULL,
  `cash_tran_in_amount` double NOT NULL DEFAULT 0,
  `cash_tran_out_amount` double NOT NULL DEFAULT 0,
  `cash_tran_created_isodt` varchar(30) NOT NULL,
  `cash_tran_updated_isodt` varchar(30) DEFAULT NULL,
  `cash_tran_created_by` int(11) NOT NULL,
  `cash_tran_updated_by` int(11) NOT NULL DEFAULT 0,
  `cash_tran_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active',
  `cash_tran_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_cash_transactions`
--

INSERT INTO `tbl_cash_transactions` (`cash_tran_id`, `cash_tran_code`, `bank_acc_id`, `cash_tran_method`, `cash_tran_type`, `cash_tran_acc_id`, `cash_tran_note`, `cash_tran_in_amount`, `cash_tran_out_amount`, `cash_tran_created_isodt`, `cash_tran_updated_isodt`, `cash_tran_created_by`, `cash_tran_updated_by`, `cash_tran_status`, `cash_tran_branch_id`) VALUES
(1, 'CT00001', 0, 'cash', 'payment', 2, 'Office Rent Advance', 0, 20000, '2021-02-20T18:00:44.426Z', '2021-02-20T18:04:18.108Z', 57, 57, 'active', 1),
(2, 'CT00002', 2, 'bank', 'payment', 3, '', 0, 5000, '2021-02-20T18:04:18.263Z', NULL, 57, 0, 'active', 1),
(3, 'CT00003', 0, 'cash', 'receive', 1, '', 650, 0, '2021-02-20T18:04:35.075Z', NULL, 57, 0, 'active', 1),
(4, 'CT00004', 0, 'cash', 'payment', 1, '', 0, 600, '2021-02-20T18:04:58.166Z', NULL, 57, 0, 'active', 1),
(5, 'CT00005', 0, 'cash', 'payment', 1, '', 0, 1000, '2021-02-20T18:05:09.327Z', NULL, 57, 0, 'active', 1),
(6, 'CT00006', 0, 'cash', 'payment', 1, '', 0, 300, '2021-02-20T18:05:23.226Z', NULL, 57, 0, 'active', 1),
(7, 'CT00007', 0, 'cash', 'receive', 1, '', 800, 0, '2021-01-31T18:05:00.000Z', NULL, 57, 0, 'active', 1),
(8, 'CT00008', 0, 'cash', 'receive', 1, '', 1100, 0, '2021-02-01T18:06:00.000Z', NULL, 57, 0, 'active', 1),
(9, 'CT00009', 0, 'cash', 'receive', 1, '', 670, 0, '2021-02-02T18:06:00.000Z', NULL, 57, 0, 'active', 1),
(10, 'CT000010', 0, 'cash', 'payment', 1, '', 0, 100, '2021-05-21T07:50:17.793Z', NULL, 57, 0, 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_checking`
--

CREATE TABLE `tbl_checking` (
  `check_id` int(11) NOT NULL,
  `app_id` varchar(10) DEFAULT NULL,
  `status` enum('a','d') NOT NULL DEFAULT 'a'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_checking`
--

INSERT INTO `tbl_checking` (`check_id`, `app_id`, `status`) VALUES
(1, 'App-1', 'd');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customers`
--

CREATE TABLE `tbl_customers` (
  `customer_id` int(11) NOT NULL,
  `customer_code` varchar(15) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_institution_name` varchar(255) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `customer_area_id` int(11) DEFAULT 0,
  `customer_mobile_no` varchar(16) DEFAULT NULL,
  `customer_phone_no` varchar(16) DEFAULT NULL,
  `customer_previous_due` double DEFAULT 0,
  `customer_credit_limit` double DEFAULT 0,
  `customer_type` enum('retail','wholesale','general') NOT NULL,
  `customer_created_isodt` varchar(30) NOT NULL,
  `customer_updated_isodt` varchar(30) DEFAULT NULL,
  `customer_created_by` int(11) NOT NULL DEFAULT 0,
  `customer_updated_by` int(11) NOT NULL DEFAULT 0,
  `customer_branch_id` int(11) NOT NULL,
  `customer_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active',
  `employee_id` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_customers`
--

INSERT INTO `tbl_customers` (`customer_id`, `customer_code`, `customer_name`, `customer_institution_name`, `customer_address`, `customer_area_id`, `customer_mobile_no`, `customer_phone_no`, `customer_previous_due`, `customer_credit_limit`, `customer_type`, `customer_created_isodt`, `customer_updated_isodt`, `customer_created_by`, `customer_updated_by`, `customer_branch_id`, `customer_status`, `employee_id`) VALUES
(3757, 'C00001', 'Joy Ram ', 'Maa Studio & Telecom', 'Boalkhali Bazar, dighinala, Khagrachari', 3128, '1715265642', '', 0, 0, 'wholesale', '2021-08-11T18:36:15.295Z', '2022-03-09T13:24:49.119Z', 57, 57, 1, 'active', 1),
(3758, 'C00002', 'Parbatta Diagnostic Lab', 'MD Atikur Rahman', 'Vai Vai mini Super Market, Boalkhali Bazar, Dighinala, Khagrachari.', 3129, '1820714060', '', 0, 0, 'retail', '2021-08-11T18:36:15.298Z', NULL, 0, 0, 1, 'active', 0),
(3759, 'C00003', 'Nishan Electronics', 'Nishan Electronics', 'Khagrachari Shadar, Khagrachari', 3134, '1556543950', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.299Z', '2022-03-09T13:18:02.532Z', 57, 57, 1, 'active', 1),
(3760, 'C00004', 'Sahajahan Telecome', 'Sahajahan Telecome', 'Khagrachari Shadar, Khagrachari', 3134, '1868141357', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.300Z', NULL, 0, 0, 1, 'active', 0),
(3761, 'C00005', 'Satkania Store', 'Satkania Store', 'Khagrachari Shadar, Khagrachari', 3134, '1881637888', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.301Z', NULL, 0, 0, 1, 'active', 0),
(3762, 'C00006', 'Rokthim Telecome', 'Rokthim Telecome', 'Khagrachari Shadar, Khagrachari', 3134, '1553516793', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.303Z', NULL, 0, 0, 1, 'active', 0),
(3763, 'C00007', 'Chawdhory Mobile Zone', 'Chawdhory Mobile Zone', 'Khagrachari Shadar, Khagrachari', 3134, '1822527252', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.305Z', NULL, 0, 0, 1, 'active', 0),
(3764, 'C00008', 'Bismillah Electronic', 'Bismillah Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1761628033', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.306Z', NULL, 0, 0, 1, 'active', 0),
(3765, 'C00009', 'Phahida Electronic', 'Phahida Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1815522414', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.307Z', NULL, 0, 0, 1, 'active', 0),
(3766, 'C00010', 'Jononi Electronic', 'Jononi Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1552705011', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.308Z', NULL, 0, 0, 1, 'active', 0),
(3767, 'C00011', 'Bismillah Telecom', 'Bismillah Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1851373767', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.309Z', NULL, 0, 0, 1, 'active', 0),
(3768, 'C00012', 'Nusrat Enterprise', 'Nusrat Enterprise', 'Khagrachari Shadar, Khagrachari', 3134, '1556562562', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.310Z', NULL, 0, 0, 1, 'active', 0),
(3769, 'C00013', 'Mobile Gllary', 'Mobile Gllary', 'Khagrachari Shadar, Khagrachari', 3134, '1830216525', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.315Z', NULL, 0, 0, 1, 'active', 0),
(3770, 'C00014', 'Mahpuja Electronic', 'Mahpuja Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1824955409', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.316Z', NULL, 0, 0, 1, 'active', 0),
(3771, 'C00015', 'Shumi Electronic', 'Shumi Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1556636020', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.317Z', NULL, 0, 0, 1, 'active', 0),
(3772, 'C00016', 'Changi Electronic', 'Changi Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1556535400', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.319Z', NULL, 0, 0, 1, 'active', 0),
(3773, 'C00017', 'Mobile Plaza', 'Mobile Plaza', 'Khagrachari Shadar, Khagrachari', 3134, '1820701647', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.319Z', NULL, 0, 0, 1, 'active', 0),
(3774, 'C00018', 'Limo Electronic', 'Limo Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1827515565', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.320Z', NULL, 0, 0, 1, 'active', 0),
(3775, 'C00019', 'Laki Watch', 'Laki Watch', 'Khagrachari Shadar, Khagrachari', 3134, '1828881626', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.320Z', NULL, 0, 0, 1, 'active', 0),
(3776, 'C00020', 'Anurupa Telecom', 'Anurupa Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1555000000', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.320Z', NULL, 0, 0, 1, 'active', 0),
(3777, 'C00021', 'Rashi Telecome', 'Rashi Telecome', 'Khagrachari Shadar, Khagrachari', 3134, '1845770209', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.321Z', NULL, 0, 0, 1, 'active', 0),
(3778, 'C00022', 'Priyom Computer', 'Priyom Computer', 'Khagrachari Shadar, Khagrachari', 3134, '1828847744', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.321Z', NULL, 0, 0, 1, 'active', 0),
(3779, 'C00023', 'Big boss', 'Big boss', 'Khagrachari Shadar, Khagrachari', 3134, '1812099050', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.322Z', NULL, 0, 0, 1, 'active', 0),
(3780, 'C00024', 'Chity Mobile Servicing', 'Chity Mobile Servicing', 'Khagrachari Shadar, Khagrachari', 3134, '1815958490', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.322Z', NULL, 0, 0, 1, 'active', 0),
(3781, 'C00025', 'Star Telecome', 'Star Telecome', 'Khagrachari Shadar, Khagrachari', 3134, '1828826610', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.323Z', NULL, 0, 0, 1, 'active', 0),
(3782, 'C00026', 'AL Jaber Enterprise', 'AL Jaber Enterprise', 'Khagrachari Shadar, Khagrachari', 3134, '1820292817', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.323Z', NULL, 0, 0, 1, 'active', 0),
(3783, 'C00027', 'Digital Electronic', 'Digital Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1815246282', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.324Z', NULL, 0, 0, 1, 'active', 0),
(3784, 'C00028', 'Brothers Electronic', 'Brothers Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1820702222', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.324Z', NULL, 0, 0, 1, 'active', 0),
(3785, 'C00029', 'Gulzar Shop', 'Gulzar Shop', 'Khagrachari Shadar, Khagrachari', 3134, '1815370783', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.325Z', NULL, 0, 0, 1, 'active', 0),
(3786, 'C00030', 'Suhaila Telecom', 'Suhaila Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1820711750', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.325Z', NULL, 0, 0, 1, 'active', 0),
(3787, 'C00031', 'Fatema Mobile Shop', 'Fatema Mobile Shop', 'Khagrachari Shadar, Khagrachari', 3134, '1874779074', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.326Z', NULL, 0, 0, 1, 'active', 0),
(3788, 'C00032', 'Misbah Technology', 'Misbah Technology', 'Khagrachari Shadar, Khagrachari', 3134, '1615057738', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.326Z', NULL, 0, 0, 1, 'active', 0),
(3789, 'C00033', 'Khan Telecom', 'Khan Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1853040404', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.327Z', NULL, 0, 0, 1, 'active', 0),
(3790, 'C00034', 'Riyan Electronic', 'Riyan Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1869433633', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.328Z', NULL, 0, 0, 1, 'active', 0),
(3791, 'C00035', 'Nidhi Electronic', 'Nidhi Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1815522413', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.328Z', NULL, 0, 0, 1, 'active', 0),
(3792, 'C00036', 'Megna Telecom', 'Megna Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1556770375', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.329Z', NULL, 0, 0, 1, 'active', 0),
(3793, 'C00037', 'Potpotra Electronic', 'Potpotra Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1827517400', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.329Z', NULL, 0, 0, 1, 'active', 0),
(3794, 'C00038', 'Gitichoyon Electronic', 'Gitichoyon Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1820703098', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.331Z', NULL, 0, 0, 1, 'active', 0),
(3795, 'C00039', 'Ashik Telecome', 'Ashik Telecome', 'Khagrachari Shadar, Khagrachari', 3134, '1818187986', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.336Z', NULL, 0, 0, 1, 'active', 0),
(3796, 'C00040', 'Bondhu Telecom', 'Bondhu Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1815508728', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.337Z', NULL, 0, 0, 1, 'active', 0),
(3797, 'C00041', 'Mizan Telecom', 'Mizan Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1849882020', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.337Z', NULL, 0, 0, 1, 'active', 0),
(3798, 'C00042', 'Rocky Telecom', 'Rocky Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1556773826', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.338Z', NULL, 0, 0, 1, 'active', 0),
(3799, 'C00043', 'Rajib Telecom', 'Rajib Telecom', 'Khagrachari Shadar, Khagrachari', 3134, '1840268840', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.339Z', NULL, 0, 0, 1, 'active', 0),
(3800, 'C00044', 'Ma Mobile Center', 'Ma Mobile Center', 'Khagrachari Shadar, Khagrachari', 3134, '1856600514', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.339Z', NULL, 0, 0, 1, 'active', 0),
(3801, 'C00045', 'Ma Department Center', 'Ma Department Center', 'Khagrachari Shadar, Khagrachari', 3134, '1818883077', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.341Z', NULL, 0, 0, 1, 'active', 0),
(3802, 'C00046', 'Gofur Electronic', 'Gofur Electronic', 'Khagrachari Shadar, Khagrachari', 3134, '1810000000', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.342Z', NULL, 0, 0, 1, 'active', 0),
(3803, 'C00047', 'Janani Computer', 'Janani Computer', 'Panchari, Khagrachari', 3145, '1820707498', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.343Z', NULL, 0, 0, 1, 'active', 0),
(3804, 'C00048', 'Jharna Electronic', 'Jharna Electronic', 'Panchari, Khagrachari', 3145, '1814297952', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.344Z', NULL, 0, 0, 1, 'active', 0),
(3805, 'C00049', 'Icon Electronic', 'Icon Electronic', 'Panchari, Khagrachari', 3145, '1820701198', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.345Z', NULL, 0, 0, 1, 'active', 0),
(3806, 'C00050', 'Boneful Electronic', 'Boneful Electronic', 'Panchari, Khagrachari', 3145, '1553244172', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.347Z', NULL, 0, 0, 1, 'active', 0),
(3807, 'C00051', 'Masud Mobile Servicing', 'Masud Mobile Servicing', 'Panchari, Khagrachari', 3145, '1831930997', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.348Z', NULL, 0, 0, 1, 'active', 0),
(3808, 'C00052', 'Shamol Telecom', 'Shamol Telecom', 'Panchari, Khagrachari', 3145, '1828822770', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.349Z', NULL, 0, 0, 1, 'active', 0),
(3809, 'C00053', 'Ma Moni Computer', 'Ma Moni Computer', 'Panchari, Khagrachari', 3145, '1824417122', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.350Z', NULL, 0, 0, 1, 'active', 0),
(3810, 'C00054', 'Chity Mobile  Servicing', 'Chity Mobile  Servicing', 'Panchari, Khagrachari', 3145, '1632597649', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.351Z', NULL, 0, 0, 1, 'active', 0),
(3811, 'C00055', 'Ma Telecom', 'Ma Telecom', 'Panchari, Khagrachari', 3145, '1829919750', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.355Z', NULL, 0, 0, 1, 'active', 0),
(3812, 'C00056', 'Aradda Mobile  Servicing', 'Aradda Mobile  Servicing', 'Panchari, Khagrachari', 3145, '1818273899', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.357Z', NULL, 0, 0, 1, 'active', 0),
(3813, 'C00057', 'Tara Digital Studio', 'Tara Digital Studio', 'Panchari, Khagrachari', 3145, '1822222222', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.359Z', NULL, 0, 0, 1, 'active', 0),
(3814, 'C00058', 'Joy Solar Hous', 'Joy Solar Hous', 'Panchari, Khagrachari', 3145, '1828929868', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.364Z', NULL, 0, 0, 1, 'active', 0),
(3815, 'C00059', 'Mobile Mela', 'Mobile Mela', 'Panchari, Khagrachari', 3145, '1862020215', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.366Z', NULL, 0, 0, 1, 'active', 0),
(3816, 'C00060', 'Alif Electronic', 'Alif Electronic', 'Panchari, Khagrachari', 3145, '1834433770', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.368Z', NULL, 0, 0, 1, 'active', 0),
(3817, 'C00061', 'Thoru Electronic', 'Thoru Electronic', 'Panchari, Khagrachari', 3145, '1557398230', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.370Z', NULL, 0, 0, 1, 'active', 0),
(3818, 'C00062', 'Rayhan Telecom', 'Rayhan Telecom', 'Panchari, Khagrachari', 3145, '1679819809', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.375Z', NULL, 0, 0, 1, 'active', 0),
(3819, 'C00063', 'Sohan Electronic', 'Sohan Electronic', 'Panchari, Khagrachari', 3145, '1531302337', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.376Z', NULL, 0, 0, 1, 'active', 0),
(3820, 'C00064', 'Proma  Electronic', 'Proma  Electronic', 'Panchari, Khagrachari', 3145, '1857649142', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.377Z', NULL, 0, 0, 1, 'active', 0),
(3821, 'C00065', 'Takiya Enterprise', 'Takiya Enterprise', 'Panchari, Khagrachari', 3145, '1867934090', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.379Z', NULL, 0, 0, 1, 'active', 0),
(3822, 'C00066', 'Choya Telecom', 'Choya Telecom', 'Panchari, Khagrachari', 3145, '1783795350', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.381Z', NULL, 0, 0, 1, 'active', 0),
(3823, 'C00067', 'Aranno Telecom', 'Aranno Telecom', 'Panchari, Khagrachari', 3145, '1758185642', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.383Z', NULL, 0, 0, 1, 'active', 0),
(3824, 'C00068', 'Shipul Telecom', 'Shipul Telecom', 'Panchari, Khagrachari', 3145, '1614444444', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.384Z', NULL, 0, 0, 1, 'active', 0),
(3825, 'C00069', 'Ma Muni Computer', 'Mamoni Computer', 'Panchari, Khagrachari', 3145, '1557346325', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.385Z', NULL, 0, 0, 1, 'active', 0),
(3826, 'C00070', 'Jononi Enterprise', 'Jononi Enterprise', 'Bhai Bon Chara, Khagrachari', 3127, '1811526059', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.386Z', NULL, 0, 0, 1, 'active', 0),
(3827, 'C00071', 'Modina Mobile Zone', 'Modina Mobile Zone', 'Bhai Bon Chara, Khagrachari', 3127, '1610234197', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.387Z', NULL, 0, 0, 1, 'active', 0),
(3828, 'C00072', 'Ityadi departmental store', 'Ityadi departmental store', 'Bhai Bon Chara, Khagrachari', 3127, '1820070884', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.388Z', NULL, 0, 0, 1, 'active', 0),
(3829, 'C00073', 'Potpotra Telecom', 'Potpotra Telecom', 'Bhai Bon Chara, Khagrachari', 3127, '1558914190', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.389Z', NULL, 0, 0, 1, 'active', 0),
(3830, 'C00074', 'Emon Telecom', 'Emon Telecom', 'Bhai Bon Chara, Khagrachari', 3127, '1865352629', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.390Z', NULL, 0, 0, 1, 'active', 0),
(3831, 'C00075', 'Shuvro Store', 'Shuvro Store', 'Bhai Bon Chara, Khagrachari', 3127, '1824825217', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.393Z', NULL, 0, 0, 1, 'active', 0),
(3832, 'C00076', 'Imran Hossain BaBu', 'Mobile Sheba', 'Mohalchari,  Khagrachari', 3144, '1821331901', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.393Z', NULL, 0, 0, 1, 'active', 0),
(3833, 'C00077', 'Shibly Traders', 'Shibly Traders', 'Mohalchari,  Khagrachari', 3144, '1827876196', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.394Z', NULL, 0, 0, 1, 'active', 0),
(3834, 'C00078', 'Somoy Bitan', 'Somoy Bitan', 'Mohalchari,  Khagrachari', 3144, '1849888863', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.395Z', NULL, 0, 0, 1, 'active', 0),
(3835, 'C00079', 'Bonolota Telecom', 'Bonolota Telecom', 'Mohalchari,  Khagrachari', 3144, '1817793213', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.395Z', NULL, 0, 0, 1, 'active', 0),
(3836, 'C00080', 'Zinuk Telecom', 'Zinuk Telecom', 'Mohalchari,  Khagrachari', 3144, '1822090356', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.396Z', NULL, 0, 0, 1, 'active', 0),
(3837, 'C00081', 'Titas Mobile Keyar', 'Titas Mobile Keyar', 'Mohalchari,  Khagrachari', 3144, '1632671133', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.397Z', NULL, 0, 0, 1, 'active', 0),
(3838, 'C00082', 'Shamima Electronic', 'Shamima Electronic', 'Mohalchari,  Khagrachari', 3144, '1845018140', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.398Z', NULL, 0, 0, 1, 'active', 0),
(3839, 'C00083', 'Phaharika Telecom', 'Phaharika Telecom', 'Mohalchari,  Khagrachari', 3144, '1860008927', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.399Z', NULL, 0, 0, 1, 'active', 0),
(3840, 'C00084', 'Royal Telecom', 'Royal Telecom', 'Mohalchari,  Khagrachari', 3144, '1791170988', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.399Z', NULL, 0, 0, 1, 'active', 0),
(3841, 'C00085', 'Rakhine Telecom', 'Rakhine Telecom', 'Mohalchari,  Khagrachari', 3144, '1644820288', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.400Z', NULL, 0, 0, 1, 'active', 0),
(3842, 'C00086', 'Sotorupa Telecom', 'Sotorupa Telecom', 'Mohalchari,  Khagrachari', 3144, '1828938117', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.401Z', NULL, 0, 0, 1, 'active', 0),
(3843, 'C00087', 'Zonkar Electronic', 'Zonkar Electronic', 'Mohalchari,  Khagrachari', 3144, '1673930168', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.401Z', NULL, 0, 0, 1, 'active', 0),
(3844, 'C00088', 'Barua Telecom', 'Barua Telecom', 'Mohalchari,  Khagrachari', 3144, '1839987829', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.402Z', NULL, 0, 0, 1, 'active', 0),
(3845, 'C00089', 'Triratna Traders', 'Triratna Traders', 'Mohalchari,  Khagrachari', 3144, '1859385555', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.402Z', NULL, 0, 0, 1, 'active', 0),
(3846, 'C00090', 'J B L Telecom', 'J B L Telecom', 'Mohalchari,  Khagrachari', 3144, '1820229505', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.403Z', NULL, 0, 0, 1, 'active', 0),
(3847, 'C00091', 'Rajib Electronic', 'Rajib Electronic', 'Mohalchari,  Khagrachari', 3144, '1827195152', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.403Z', NULL, 0, 0, 1, 'active', 0),
(3848, 'C00092', 'Rubel Telecom', 'Rubel Telecom', 'Mohalchari,  Khagrachari', 3144, '1816136468', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.404Z', NULL, 0, 0, 1, 'active', 0),
(3849, 'C00093', 'Juyel Telecom', 'Juyel Telecom', 'Mohalchari,  Khagrachari', 3144, '1811502931', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.404Z', NULL, 0, 0, 1, 'active', 0),
(3850, 'C00094', 'Jononi Telecom', 'Jononi Telecom', 'Mohalchari,  Khagrachari', 3144, '1838496649', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.405Z', NULL, 0, 0, 1, 'active', 0),
(3851, 'C00095', '7 Star Telecom', '7 Star Telecom', 'Mohalchari,  Khagrachari', 3144, '1812544791', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.408Z', NULL, 0, 0, 1, 'active', 0),
(3852, 'C00096', 'Ityadi Telecom', 'Ityadi Telecom', 'Mohalchari,  Khagrachari', 3144, '1632454006', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.409Z', NULL, 0, 0, 1, 'active', 0),
(3853, 'C00097', 'Jeki Telecom', 'Jeki Telecom', 'Mohalchari,  Khagrachari', 3144, '1869942258', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.410Z', NULL, 0, 0, 1, 'active', 0),
(3854, 'C00098', 'Photo Point', 'Photo Point', 'Maischari, Khagrachari', 3140, '1632671098', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.411Z', NULL, 0, 0, 1, 'active', 0),
(3855, 'C00099', 'Dighanta Telecom', 'Dighanta Telecom', 'Maischari, Khagrachari', 3140, '1877124182', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.412Z', NULL, 0, 0, 1, 'active', 0),
(3856, 'C00100', 'Shohel Telecom', 'Shohel Telecom', 'Maischari, Khagrachari', 3140, '1864830878', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.412Z', NULL, 0, 0, 1, 'active', 0),
(3857, 'C00101', 'Ma Telecom', 'Ma Telecom', 'Maischari, Khagrachari', 3140, '1845763789', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.413Z', NULL, 0, 0, 1, 'active', 0),
(3858, 'C00102', 'Bai Bai Electronic', 'Bai Bai Electronic', 'Maischari, Khagrachari', 3140, '1837718475', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.418Z', NULL, 0, 0, 1, 'active', 0),
(3859, 'C00103', 'Hafiza Electronic', 'Hafiza Electronic', 'Maischari, Khagrachari', 3140, '1817795193', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.419Z', NULL, 0, 0, 1, 'active', 0),
(3860, 'C00104', ' Mustafiz Library', ' Mustafiz Library', 'Maischari, Khagrachari', 3140, '1849886688', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.419Z', NULL, 0, 0, 1, 'active', 0),
(3861, 'C00105', 'Nasir Electronic', 'Nasir Electronic', 'Maischari, Khagrachari', 3140, '1830120136', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.420Z', NULL, 0, 0, 1, 'active', 0),
(3862, 'C00106', 'Paharika Telecom', 'Paharika Telecom', 'Maischari, Khagrachari', 3140, '1558913295', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.422Z', NULL, 0, 0, 1, 'active', 0),
(3863, 'C00107', 'B N Electronic', 'B N Electronic', 'Maischari, Khagrachari', 3140, '1848181350', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.424Z', NULL, 0, 0, 1, 'active', 0),
(3864, 'C00108', 'Raju Telecom', 'Raju Telecom', 'Maischari, Khagrachari', 3140, '1690036556', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.424Z', NULL, 0, 0, 1, 'active', 0),
(3865, 'C00109', 'Nazrul Telecom', 'Nazrul Telecom', 'Maischari, Khagrachari', 3140, '1884052620', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.425Z', NULL, 0, 0, 1, 'active', 0),
(3866, 'C00110', 'Anwar Telecom', 'Anwar Telecom', 'Maischari, Khagrachari', 3140, '1828834148', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.425Z', NULL, 0, 0, 1, 'active', 0),
(3867, 'C00111', 'Suprio Telecom', 'Suprio Telecom', 'Maischari, Khagrachari', 3140, '1648168669', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.426Z', NULL, 0, 0, 1, 'active', 0),
(3868, 'C00112', 'Protiva Library', 'Protiva Library', 'Maischari, Khagrachari', 3140, '1614191972', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.427Z', NULL, 0, 0, 1, 'active', 0),
(3869, 'C00113', 'Helal Telecom', 'Helal Telecom', 'Matiranga, Khagrachari', 3143, '1521456030', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.428Z', NULL, 0, 0, 1, 'active', 0),
(3870, 'C00114', 'Matiranga Computer', 'Matiranga Computer', 'Matiranga, Khagrachari', 3143, '1878204992', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.428Z', NULL, 0, 0, 1, 'active', 0),
(3871, 'C00115', 'Bismillah Telecom', 'Bismillah Telecom', 'Matiranga, Khagrachari', 3143, '1577777777', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.429Z', NULL, 0, 0, 1, 'active', 0),
(3872, 'C00116', 'Kishan Telecom', 'Kishan Telecom', 'Matiranga, Khagrachari', 3143, '1854359660', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.430Z', NULL, 0, 0, 1, 'active', 0),
(3873, 'C00117', 'Shamim Telecom', 'Shamim Telecom', 'Matiranga, Khagrachari', 3143, '1559744113', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.432Z', NULL, 0, 0, 1, 'active', 0),
(3874, 'C00118', 'Hasan Telecom', 'Hasan Telecom', 'Matiranga, Khagrachari', 3143, '1557073026', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.433Z', NULL, 0, 0, 1, 'active', 0),
(3875, 'C00119', 'Sumon Telecom', 'Sumon Telecom', 'Matiranga, Khagrachari', 3143, '1551982120', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.433Z', NULL, 0, 0, 1, 'active', 0),
(3876, 'C00120', 'Imran Telecom', 'Imran Telecom', 'Matiranga, Khagrachari', 3143, '1521238884', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.434Z', NULL, 0, 0, 1, 'active', 0),
(3877, 'C00121', 'Alam Telecom', 'Alam Telecom', 'Matiranga, Khagrachari', 3143, '1707400408', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.435Z', NULL, 0, 0, 1, 'active', 0),
(3878, 'C00122', 'Roki Mobile', 'Roki Mobile', 'Matiranga, Khagrachari', 3143, '1553651616', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.436Z', NULL, 0, 0, 1, 'active', 0),
(3879, 'C00123', 'Aisha Mobile', 'Aisha Mobile', 'Matiranga, Khagrachari', 3143, '1851148482', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.436Z', NULL, 0, 0, 1, 'active', 0),
(3880, 'C00124', 'Priota Electronic', 'Priota Electronic', 'Matiranga, Khagrachari', 3143, '1812579581', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.437Z', NULL, 0, 0, 1, 'active', 0),
(3881, 'C00125', 'Pervez Telecom', 'Pervez Telecom', 'Matiranga, Khagrachari', 3143, '1876100700', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.438Z', NULL, 0, 0, 1, 'active', 0),
(3882, 'C00126', 'Kolpona Electronic', 'Kolpona Electronic', 'Matiranga, Khagrachari', 3143, '1557900500', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.439Z', NULL, 0, 0, 1, 'active', 0),
(3883, 'C00127', 'Sohidul Telecom', 'Sohidul Telecom', 'Matiranga, Khagrachari', 3143, '1858840021', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.439Z', NULL, 0, 0, 1, 'active', 0),
(3884, 'C00128', 'Kolpona Electronic', 'Kolpona Electronic', 'Matiranga, Khagrachari', 3143, '1866662600', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.440Z', NULL, 0, 0, 1, 'active', 0),
(3885, 'C00129', 'Amin Electronic', 'Amin Electronic', 'Matiranga, Khagrachari', 3143, '1552727207', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.441Z', NULL, 0, 0, 1, 'active', 0),
(3886, 'C00130', 'Nur  Electronic', 'Nur  Electronic', 'Matiranga, Khagrachari', 3143, '1729178284', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.441Z', NULL, 0, 0, 1, 'active', 0),
(3887, 'C00131', 'mobile Klinik', 'mobile Klinik', 'Matiranga, Khagrachari', 3143, '1552426610', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.442Z', NULL, 0, 0, 1, 'active', 0),
(3888, 'C00132', 'Bai bai Electronic', 'Bai bai Electronic', 'Matiranga, Khagrachari', 3143, '1811274209', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.443Z', NULL, 0, 0, 1, 'active', 0),
(3889, 'C00133', 'Anwar Telecom', 'Anwar Telecom', 'Matiranga, Khagrachari', 3143, '1515223291', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.444Z', NULL, 0, 0, 1, 'active', 0),
(3890, 'C00134', 'Mamun Telecom', 'Mamun Telecom', 'Matiranga, Khagrachari', 3143, '1883611723', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.445Z', NULL, 0, 0, 1, 'active', 0),
(3891, 'C00135', 'Arfin Telecom', 'Arfin Telecom', 'Matiranga, Khagrachari', 3143, '1820368510', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.445Z', NULL, 0, 0, 1, 'active', 0),
(3892, 'C00136', 'Depok Mobile Servicing', 'Depok Mobile Servicing', 'Matiranga, Khagrachari', 3143, '1553028631', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.446Z', NULL, 0, 0, 1, 'active', 0),
(3893, 'C00137', 'Moshior Telecom', 'Moshior Telecom', 'Matiranga, Khagrachari', 3143, '1553764498', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.452Z', NULL, 0, 0, 1, 'active', 0),
(3894, 'C00138', 'Trisha Telecom', 'Trisha Telecom', 'Matiranga, Khagrachari', 3143, '1622429090', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.453Z', NULL, 0, 0, 1, 'active', 0),
(3895, 'C00139', 'Ma Mobile Servicing', 'Ma Mobile Servicing', 'Matiranga, Khagrachari', 3143, '1515223224', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.456Z', NULL, 0, 0, 1, 'active', 0),
(3896, 'C00140', 'Trisha Telecom (2)', 'Trisha Telecom (2)', 'Matiranga, Khagrachari', 3143, '1739333709', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.457Z', NULL, 0, 0, 1, 'active', 0),
(3897, 'C00141', 'Afra Telecom', 'Afra Telecom', 'Matiranga, Khagrachari', 3143, '1878747745', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.458Z', NULL, 0, 0, 1, 'active', 0),
(3898, 'C00142', 'Adiba Fashion', 'Adiba Fashion', 'Guimara, Khagrachari', 3131, '1853132109', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.458Z', NULL, 0, 0, 1, 'active', 0),
(3899, 'C00143', 'Hoque Cloth Store', 'Hoque Cloth Store', 'Guimara, Khagrachari', 3131, '1531566637', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.459Z', NULL, 0, 0, 1, 'active', 0),
(3900, 'C00144', 'Anik Telecom', 'Anik Telecom', 'Guimara, Khagrachari', 3131, '1853042188', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.460Z', NULL, 0, 0, 1, 'active', 0),
(3901, 'C00145', 'Joynal Telecom', 'Joynal Telecom', 'Guimara, Khagrachari', 3131, '1833509878', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.460Z', NULL, 0, 0, 1, 'active', 0),
(3902, 'C00146', 'Ismail Telecom', 'Ismail Telecom', 'Guimara, Khagrachari', 3131, '1866690496', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.461Z', NULL, 0, 0, 1, 'active', 0),
(3903, 'C00147', 'Monju Watch', 'Monju Watch', 'Guimara, Khagrachari', 3131, '1991458731', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.462Z', NULL, 0, 0, 1, 'active', 0),
(3904, 'C00148', 'Sagor Telecom', 'Sagor Telecom', 'Guimara, Khagrachari', 3131, '1900000000', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.462Z', NULL, 0, 0, 1, 'active', 0),
(3905, 'C00149', 'Emtias Enterprise', 'Emtias Enterprise', 'Guimara, Khagrachari', 3131, '1885336411', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.463Z', NULL, 0, 0, 1, 'active', 0),
(3906, 'C00150', 'Shanti Telecom', 'Shanti Telecom', 'Guimara, Khagrachari', 3131, '1820202094', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.465Z', NULL, 0, 0, 1, 'active', 0),
(3907, 'C00151', 'Friends Telecom', 'Friends Telecom', 'Guimara, Khagrachari', 3131, '1889970231', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.465Z', NULL, 0, 0, 1, 'active', 0),
(3908, 'C00152', 'Khandakar Electronic', 'Khandakar Electronic', 'Guimara, Khagrachari', 3131, '1971184140', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.466Z', NULL, 0, 0, 1, 'active', 0),
(3909, 'C00153', 'Amin Solar', 'Amin Solar', 'Guimara, Khagrachari', 3131, '1900000001', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.467Z', NULL, 0, 0, 1, 'active', 0),
(3910, 'C00154', 'R S Telecom', 'R S Telecom', 'Guimara, Khagrachari', 3131, '1864143320', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.467Z', NULL, 0, 0, 1, 'active', 0),
(3911, 'C00155', 'Sheikh Electronic', 'Sheikh Electronic', 'Guimara, Khagrachari', 3131, '1845135072', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.468Z', NULL, 0, 0, 1, 'active', 0),
(3912, 'C00156', 'Shipul Telecom', 'Shipul Telecom', 'Jaliapara Khagrachari', 3132, '1556748710', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.469Z', NULL, 0, 0, 1, 'active', 0),
(3913, 'C00157', 'Riad Telecom', 'Riad Telecom', 'Jaliapara Khagrachari', 3132, '1812100540', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.469Z', NULL, 0, 0, 1, 'active', 0),
(3914, 'C00158', 'Bellal Telecom', 'Bellal Telecom', 'Jaliapara Khagrachari', 3132, '1554554600', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.470Z', NULL, 0, 0, 1, 'active', 0),
(3915, 'C00159', '1 To 99 Telecom', '1 To 99 Telecom', 'Jaliapara Khagrachari', 3132, '1537440192', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.471Z', NULL, 0, 0, 1, 'active', 0),
(3916, 'C00160', 'Mujahid Telecom', 'Mujahid Telecom', 'Jaliapara Khagrachari', 3132, '1637077187', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.471Z', NULL, 0, 0, 1, 'active', 0),
(3917, 'C00161', 'Jony Telecom', 'Jony Telecom', 'Jaliapara Khagrachari', 3132, '1864131550', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.472Z', NULL, 0, 0, 1, 'active', 0),
(3918, 'C00162', 'Ma Telecom', 'Ma Telecom', 'Jaliapara Khagrachari', 3132, '1828584879', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.473Z', NULL, 0, 0, 1, 'active', 0),
(3919, 'C00163', 'Taspiya Telecom', 'Taspiya Telecom', 'Jaliapara Khagrachari', 3132, '1727459960', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.473Z', NULL, 0, 0, 1, 'active', 0),
(3920, 'C00164', 'Mahi Telecom', 'Mahi Telecom', 'Manik Chari, Khagrachari', 3141, '1619701770', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.474Z', NULL, 0, 0, 1, 'active', 0),
(3921, 'C00165', 'Sojib Mobile Center', 'Sojib Mobile Center', 'Manik Chari, Khagrachari', 3141, '1837213620', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.474Z', NULL, 0, 0, 1, 'active', 0),
(3922, 'C00166', 'Mariya Solar', 'Mariya Solar', 'Manik Chari, Khagrachari', 3141, '1881616716', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.475Z', NULL, 0, 0, 1, 'active', 0),
(3923, 'C00167', 'Ityadi Store', 'Ityadi Store', 'Manik Chari, Khagrachari', 3141, '1837848441', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.476Z', NULL, 0, 0, 1, 'active', 0),
(3924, 'C00168', 'Arpita Electronic', 'Arpita Electronic', 'Manik Chari, Khagrachari', 3141, '1554732003', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.476Z', NULL, 0, 0, 1, 'active', 0),
(3925, 'C00169', 'Master Electronic', 'Master Electronic', 'Manik Chari, Khagrachari', 3141, '1552700591', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.477Z', NULL, 0, 0, 1, 'active', 0),
(3926, 'C00170', 'National Electronic', 'National Electronic', 'Manik Chari, Khagrachari', 3141, '1822323026', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.478Z', NULL, 0, 0, 1, 'active', 0),
(3927, 'C00171', 'SSF Telecom', 'SSF Telecom', 'Manik Chari, Khagrachari', 3141, '1819944429', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.478Z', NULL, 0, 0, 1, 'active', 0),
(3928, 'C00172', 'Ok Telecom', 'Ok Telecom', 'Manik Chari, Khagrachari', 3141, '1745972115', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.482Z', NULL, 0, 0, 1, 'active', 0),
(3929, 'C00173', 'Ma Telecom', 'Ma Telecom', 'Manik Chari, Khagrachari', 3141, '1834790659', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.482Z', NULL, 0, 0, 1, 'active', 0),
(3930, 'C00174', 'Hisab Telecom', 'Hisab Telecom', 'Manik Chari, Khagrachari', 3141, '1822721945', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.483Z', NULL, 0, 0, 1, 'active', 0),
(3931, 'C00175', 'N Hoque Telecom', 'N Hoque Telecom', 'Manik Chari, Khagrachari', 3141, '1817771449', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.484Z', NULL, 0, 0, 1, 'active', 0),
(3932, 'C00176', 'Bondhona Telecom', 'Bondhona Telecom', 'Manik Chari, Khagrachari', 3141, '1822300734', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.485Z', NULL, 0, 0, 1, 'active', 0),
(3933, 'C00177', 'Mir Enterprise', 'Mir Enterprise', 'Manik Chari, Khagrachari', 3141, '1813343851', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.485Z', NULL, 0, 0, 1, 'active', 0),
(3934, 'C00178', 'Belal Electronic', 'Belal Electronic', 'Manik Chari, Khagrachari', 3141, '1713631071', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.486Z', NULL, 0, 0, 1, 'active', 0),
(3935, 'C00179', 'Ok Girt House', 'Ok Girt House', 'Manik Chari, Khagrachari', 3141, '1828876947', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.487Z', NULL, 0, 0, 1, 'active', 0),
(3936, 'C00180', 'Shima Electronic', 'Shima Electronic', 'Manik Chari, Khagrachari', 3141, '1812425128', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.488Z', NULL, 0, 0, 1, 'active', 0),
(3937, 'C00181', 'Ma Telecom MC', 'Ma Telecom MC', 'Manik Chari, Khagrachari', 3141, '1840398524', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.488Z', NULL, 0, 0, 1, 'active', 0),
(3938, 'C00182', 'Fariha Telecom', 'Fariha Telecom', 'Manik Chari, Khagrachari', 3141, '1633509469', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.489Z', NULL, 0, 0, 1, 'active', 0),
(3939, 'C00183', 'S S Telecom', 'S S Telecom', 'Manik Chari, Khagrachari', 3141, '1960914559', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.491Z', NULL, 0, 0, 1, 'active', 0),
(3940, 'C00184', 'Johir Telecom', 'Johir Telecom', 'Manik Chari, Khagrachari', 3141, '1874995760', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.491Z', NULL, 0, 0, 1, 'active', 0),
(3941, 'C00185', 'Raju Telecom', 'Raju Telecom', 'Manik Chari, Khagrachari', 3141, '1821364312', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.492Z', NULL, 0, 0, 1, 'active', 0),
(3942, 'C00186', 'Box Telecom', 'Box Telecom', 'Manik Chari, Khagrachari', 3141, '1558801285', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.493Z', NULL, 0, 0, 1, 'active', 0),
(3943, 'C00187', 'Ma Mobile Servicing', 'Ma Mobile Servicing', 'Manik Chari, Khagrachari', 3141, '1875983979', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.493Z', NULL, 0, 0, 1, 'active', 0),
(3944, 'C00188', 'Riya Telecom', 'Riya Telecom', 'Manik Chari, Khagrachari', 3141, '1834419964', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.494Z', NULL, 0, 0, 1, 'active', 0),
(3945, 'C00189', 'Shema Electronic', 'Shema Electronic', 'Manik Chari, Khagrachari', 3141, '1811294042', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.494Z', NULL, 0, 0, 1, 'active', 0),
(3946, 'C00190', 'Yousof Telecom', 'Yousof Telecom', 'Manik Chari, Khagrachari', 3141, '1818968740', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.495Z', NULL, 0, 0, 1, 'active', 0),
(3947, 'C00191', 'Belal Telecom', 'Belal Telecom', 'Manik Chari, Khagrachari', 3141, '1866662444', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.495Z', NULL, 0, 0, 1, 'active', 0),
(3948, 'C00192', 'ilius Telecom', 'ilius Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1557073121', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.496Z', NULL, 0, 0, 1, 'active', 0),
(3949, 'C00193', 'Maya Telecom', 'Maya Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1849888988', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.497Z', NULL, 0, 0, 1, 'active', 0),
(3950, 'C00194', 'Nishi Telecom', 'Nishi Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1860147575', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.497Z', NULL, 0, 0, 1, 'active', 0),
(3951, 'C00195', 'Sowkot Telecom', 'Sowkot Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1648091995', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.498Z', NULL, 0, 0, 1, 'active', 0),
(3952, 'C00196', 'Habib Telecom', 'Habib Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1874796079', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.498Z', NULL, 0, 0, 1, 'active', 0),
(3953, 'C00197', 'Shohel Enterprise', 'Shohel Enterprise', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1820710163', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.499Z', NULL, 0, 0, 1, 'active', 0),
(3954, 'C00198', 'Jamal Telecom', 'Jamal Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1878747435', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.500Z', NULL, 0, 0, 1, 'active', 0),
(3955, 'C00199', 'Kamal Telecom', 'Kamal Telecom', 'Baghaihat Bazar, Bagichari,  Rangamaty', 3125, '1837183111', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.501Z', NULL, 0, 0, 1, 'active', 0),
(3956, 'C00200', 'Ma Telecom', 'Ma Telecom', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1820735169', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.501Z', NULL, 0, 0, 1, 'active', 0),
(3957, 'C00201', 'Napal Store', 'Napal Store', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1552700740', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.502Z', NULL, 0, 0, 1, 'active', 0),
(3958, 'C00202', 'Samadan Store', 'Samadan Store', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1883612600', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.502Z', NULL, 0, 0, 1, 'active', 0),
(3959, 'C00203', 'Pracurjo Telecom', 'Pracurjo Telecom', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1828805522', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.503Z', NULL, 0, 0, 1, 'active', 0),
(3960, 'C00204', 'Topon Telecom', 'Topon Telecom', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1820745797', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.503Z', NULL, 0, 0, 1, 'active', 0),
(3961, 'C00205', 'Mone Rekho Store', 'Mone Rekho Store', 'Korengatoli, Baghaichari, Rangamaty', 3135, '1552718740', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.504Z', NULL, 0, 0, 1, 'active', 0),
(3962, 'C00206', 'Mashuk Gift Kornar', 'Mashuk Gift Kornar', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1846591471', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.505Z', NULL, 0, 0, 1, 'active', 0),
(3963, 'C00207', 'Barua Telecom & Studio', 'Barua Telecom & Studio', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1828810400', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.505Z', NULL, 0, 0, 1, 'active', 0),
(3964, 'C00208', 'Rajes Telecom', 'Rajes Telecom', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1833080311', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.508Z', NULL, 0, 0, 1, 'active', 0),
(3965, 'C00209', 'Habib Electronic', 'Habib Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1852400593', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.509Z', NULL, 0, 0, 1, 'active', 0),
(3966, 'C00210', 'Baghichari Electronic', 'Baghichari Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1533565409', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.509Z', NULL, 0, 0, 1, 'active', 0),
(3967, 'C00211', 'Barua Electronic', 'Barua Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1828814444', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.510Z', NULL, 0, 0, 1, 'active', 0),
(3968, 'C00212', 'Nagar Electronic', 'Nagar Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1536033444', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.511Z', NULL, 0, 0, 1, 'active', 0),
(3969, 'C00213', 'Ma Telecom', 'Ma Telecom', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1877560641', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.512Z', NULL, 0, 0, 1, 'active', 0),
(3970, 'C00214', 'Mobile Care', 'Mobile Care', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1821408090', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.512Z', NULL, 0, 0, 1, 'active', 0),
(3971, 'C00215', 'Ajmir Electronic', 'Ajmir Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1572400811', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.513Z', NULL, 0, 0, 1, 'active', 0),
(3972, 'C00216', 'Nijam Electronic', 'Nijam Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1839774497', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.514Z', NULL, 0, 0, 1, 'active', 0),
(3973, 'C00217', 'Johir Electronic', 'Johir Electronic', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1828204412', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.514Z', NULL, 0, 0, 1, 'active', 0),
(3974, 'C00218', 'Al Madina Telecom', 'Al Madina Telecom', 'Marissa Bazar, Baghaichari, Rangamaty', 3142, '1827573124', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.515Z', NULL, 0, 0, 1, 'active', 0),
(3975, 'C00219', 'Bristi Telecom', 'MD Bashir ', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1838485358', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.516Z', NULL, 0, 0, 1, 'active', 0),
(3976, 'C00220', 'Aisha Telecom', 'Aisha Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1882761101', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.516Z', NULL, 0, 0, 1, 'active', 0),
(3977, 'C00221', 'Pipulu Telecom', 'Pipulu Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1814772289', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.517Z', NULL, 0, 0, 1, 'active', 0),
(3978, 'C00222', 'Fahima Electronic', 'Fahima Electronic', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1881211172', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.518Z', NULL, 0, 0, 1, 'active', 0),
(3979, 'C00223', 'Noman Telecom', 'Noman Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1848257699', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.518Z', NULL, 0, 0, 1, 'active', 0),
(3980, 'C00224', 'New Jonoprio Telecom', 'New Jonoprio Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1859659777', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.519Z', NULL, 0, 0, 1, 'active', 0),
(3981, 'C00225', 'Anla mobile service', 'Anla mobile service', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1812610592', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.520Z', NULL, 0, 0, 1, 'active', 0),
(3982, 'C00226', 'Anamika Store', 'Anamika Store', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1556987501', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.520Z', NULL, 0, 0, 1, 'active', 0),
(3983, 'C00227', 'Mintu Telecom', 'Mintu Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1818269454', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.521Z', NULL, 0, 0, 1, 'active', 0),
(3984, 'C00228', 'Ma Telecom', 'Ma Telecom', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1856840180', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.521Z', NULL, 0, 0, 1, 'active', 0),
(3985, 'C00229', 'Koli Fashion', 'Koli Fashion', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1868891067', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.522Z', NULL, 0, 0, 1, 'active', 0),
(3986, 'C00230', 'Ma Telecom Babuchara', 'Ma Telecom Babuchara', 'Babuchara Bazar, Dighinala, Khagrachari', 3124, '1868891067', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.523Z', NULL, 0, 0, 1, 'active', 0),
(3987, 'C00231', 'Dighanta Telecom', 'Dighanta Telecom', 'Machalong, Baghaichari, Rangamaty', 3137, '1614212159', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.523Z', NULL, 0, 0, 1, 'active', 0),
(3988, 'C00232', 'Sreya Electronic', 'Sreya Electronic', 'Machalong, Baghaichari, Rangamaty', 3137, '1820717297', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.524Z', NULL, 0, 0, 1, 'active', 0),
(3989, 'C00233', 'Jolil Store', 'Jolil Store', 'Machalong, Baghaichari, Rangamaty', 3137, '1838963625', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.524Z', NULL, 0, 0, 1, 'active', 0),
(3990, 'C00234', 'Munni Store', 'Munni Store', 'Machalong, Baghaichari, Rangamaty', 3137, '1843048408', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.525Z', NULL, 0, 0, 1, 'active', 0),
(3991, 'C00235', 'Mijan Telecom', 'Mijan Telecom', 'Machalong, Baghaichari, Rangamaty', 3137, '1872727272', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.525Z', NULL, 0, 0, 1, 'active', 0),
(3992, 'C00236', 'Loknath Electronic', 'Loknath Electronic', 'Machalong, Baghaichari, Rangamaty', 3137, '1828116969', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.526Z', NULL, 0, 0, 1, 'active', 0),
(3993, 'C00237', 'Sumon Telecom', 'Sumon Telecom', 'Machalong, Baghaichari, Rangamaty', 3137, '1881883563', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.527Z', NULL, 0, 0, 1, 'active', 0),
(3994, 'C00238', 'Alam Machinery', 'Alam Machinery', 'Langadu Bazar, Rangamaty', 3136, '1553125488', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.527Z', NULL, 0, 0, 1, 'active', 0),
(3995, 'C00239', 'Sruborna Electronic', 'Sruborna Electronic', 'Langadu Bazar, Rangamaty', 3136, '1557410555', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.528Z', NULL, 0, 0, 1, 'active', 0),
(3996, 'C00240', 'Al Rabbi Electronic', 'Al Rabbi Electronic', 'Langadu Bazar, Rangamaty', 3136, '1882764882', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.528Z', NULL, 0, 0, 1, 'active', 0),
(3997, 'C00241', 'Rayhan Telecom', 'Rayhan Telecom', 'Langadu Bazar, Rangamaty', 3136, '1875506341', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.529Z', NULL, 0, 0, 1, 'active', 0),
(3998, 'C00242', 'Sakib Stoer', 'Sakib Stoer', 'Langadu Bazar, Rangamaty', 3136, '1857444450', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.529Z', NULL, 0, 0, 1, 'active', 0),
(3999, 'C00243', 'Bismilla Enterprise', 'Bismilla Enterprise', 'Langadu Bazar, Rangamaty', 3136, '1856603355', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.530Z', NULL, 0, 0, 1, 'active', 0),
(4000, 'C00244', 'Sbapna Telecom', 'Sbapna Telecom', 'Langadu Bazar, Rangamaty', 3136, '1812755662', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.531Z', NULL, 0, 0, 1, 'active', 0),
(4001, 'C00245', 'Priyanka Store', 'Priyanka Store', 'Langadu Bazar, Rangamaty', 3136, '1840285085', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.534Z', NULL, 0, 0, 1, 'active', 0),
(4002, 'C00246', 'Farbej Store', 'Farbej Store', 'Langadu Bazar, Rangamaty', 3136, '1531578622', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.534Z', NULL, 0, 0, 1, 'active', 0),
(4003, 'C00247', 'Jia  Photostat', 'Jia  Photostat', 'Langadu Bazar, Rangamaty', 3136, '1552430604', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.535Z', NULL, 0, 0, 1, 'active', 0),
(4004, 'C00248', 'K M Motors', 'K M Motors', 'Langadu Bazar, Rangamaty', 3136, '1829112545', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.536Z', NULL, 0, 0, 1, 'active', 0),
(4005, 'C00249', 'Bismilla Crokarise', 'Bismilla Crokarise', 'Langadu Bazar, Rangamaty', 3136, '1860614434', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.537Z', NULL, 0, 0, 1, 'active', 0),
(4006, 'C00250', 'Siad Telecom', 'Siad Telecom', 'Langadu Bazar, Rangamaty', 3136, '1555555555', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.537Z', NULL, 0, 0, 1, 'active', 0),
(4007, 'C00251', 'Mostofa Telecom', 'Mostofa Telecom', 'Langadu Bazar, Rangamaty', 3136, '1831051153', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.538Z', NULL, 0, 0, 1, 'active', 0),
(4008, 'C00252', 'Momin Telecom', 'Momin Telecom', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1811561347', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.542Z', NULL, 0, 0, 1, 'active', 0),
(4009, 'C00253', 'Bai Bai Machinery', 'Bai Bai Machinery', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1869630627', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.543Z', NULL, 0, 0, 1, 'active', 0),
(4010, 'C00254', 'Rasel Machinery', 'Rasel Machinery', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1811561361', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.544Z', NULL, 0, 0, 1, 'active', 0),
(4011, 'C00255', 'Ena Enterprise', 'Ena Enterprise', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1614455860', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.545Z', NULL, 0, 0, 1, 'active', 0),
(4012, 'C00256', 'Rakib Telecom', 'Rakib Telecom', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1557188999', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.545Z', NULL, 0, 0, 1, 'active', 0),
(4013, 'C00257', 'Mobile Zone', 'Mobile Zone', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1557111131', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.546Z', NULL, 0, 0, 1, 'active', 0),
(4014, 'C00258', 'Boi Bitan', 'Boi Bitan', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1553993139', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.547Z', NULL, 0, 0, 1, 'active', 0),
(4015, 'C00259', 'Friends Telecom', 'Friends Telecom', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1845771355', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.548Z', NULL, 0, 0, 1, 'active', 0),
(4016, 'C00260', 'Emon Telecom', 'Emon Telecom', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1557347474', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.548Z', NULL, 0, 0, 1, 'active', 0),
(4017, 'C00261', 'Nazrul Computer', 'Nazrul Computer', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1632348415', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.549Z', NULL, 0, 0, 1, 'active', 0),
(4018, 'C00262', 'Sohel Battery Hous', 'Sohel Battery Hous', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1864758758', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.553Z', NULL, 0, 0, 1, 'active', 0),
(4019, 'C00263', 'Sohel Electronic', 'Sohel Electronic', 'Maini Mukh Bazar, Longadu, Rangamaty', 3139, '1820358372', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.554Z', NULL, 0, 0, 1, 'active', 0),
(4020, 'C00264', 'Sobi Telecom', 'Sobi Telecom', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1553108264', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.555Z', NULL, 0, 0, 1, 'active', 0);
INSERT INTO `tbl_customers` (`customer_id`, `customer_code`, `customer_name`, `customer_institution_name`, `customer_address`, `customer_area_id`, `customer_mobile_no`, `customer_phone_no`, `customer_previous_due`, `customer_credit_limit`, `customer_type`, `customer_created_isodt`, `customer_updated_isodt`, `customer_created_by`, `customer_updated_by`, `customer_branch_id`, `customer_status`, `employee_id`) VALUES
(4021, 'C00265', 'Jononi Electronic', 'Jononi Electronic', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1837847478', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.556Z', NULL, 0, 0, 1, 'active', 0),
(4022, 'C00266', 'K B Electronic', 'K B Electronic', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1885335829', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.559Z', NULL, 0, 0, 1, 'active', 0),
(4023, 'C00267', 'MSN Telecom', 'MSN Telecom', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1739337192', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.560Z', NULL, 0, 0, 1, 'active', 0),
(4024, 'C00268', 'Dhaka Telecom', 'Dhaka Telecom', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1822122436', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.560Z', NULL, 0, 0, 1, 'active', 0),
(4025, 'C00269', 'Jononi Telecom 2', 'Jononi Telecom 2', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1837847478', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.562Z', NULL, 0, 0, 1, 'active', 0),
(4026, 'C00270', 'MTC Electronic', 'MTC Electronic', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1849888240', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.563Z', NULL, 0, 0, 1, 'active', 0),
(4027, 'C00271', 'Siraj Telecom', 'Siraj Telecom', 'Thana Bazar, Dighinala, Khagrachari', 3146, '1557683866', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.565Z', NULL, 0, 0, 1, 'active', 0),
(4028, 'C00272', 'Google Telecom', 'MD Ibrahim ', 'Kabakali,Dighinala, Khagrachari', 3133, '1875558666', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.566Z', NULL, 0, 0, 1, 'active', 0),
(4029, 'C00273', 'Abdullah Telecom', 'MD Balal Hossain', 'Kabakali,Dighinala, Khagrachari', 3133, '1633509440', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.568Z', NULL, 0, 0, 1, 'active', 0),
(4030, 'C00274', 'AL Modina Telecom', 'AL Modina Telecom', 'Kabakali,Dighinala, Khagrachari', 3133, '1860102098', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.568Z', NULL, 0, 0, 1, 'active', 0),
(4031, 'C00275', 'Ittadi Library', 'MD Abul Kalam', 'Kabakali,Dighinala, Khagrachari', 3133, '1837848412', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.571Z', NULL, 0, 0, 1, 'active', 0),
(4032, 'C00276', 'Bismillah Telecom', 'Bismillah Telecom', 'Kabakali,Dighinala, Khagrachari', 3133, '1856109540', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.571Z', NULL, 0, 0, 1, 'active', 0),
(4033, 'C00277', 'Sadia Telecom', 'MD Manju', 'Kabakali,Dighinala, Khagrachari', 3133, '1837848494', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.572Z', NULL, 0, 0, 1, 'active', 0),
(4034, 'C00278', 'Balal Telecom', 'Balal Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1638092395', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.573Z', NULL, 0, 0, 1, 'active', 0),
(4035, 'C00279', 'Chadga Telecom', 'Chadga Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1878200666', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.573Z', NULL, 0, 0, 1, 'active', 0),
(4036, 'C00280', 'Shipul Telecom', 'Shipul Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1849886244', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.574Z', NULL, 0, 0, 1, 'active', 0),
(4037, 'C00281', 'Anowar Telecom', 'Anowar Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1860102092', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.574Z', NULL, 0, 0, 1, 'active', 0),
(4038, 'C00282', 'Maya Telecom', 'Maya Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1558918051', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.578Z', NULL, 0, 0, 1, 'active', 0),
(4039, 'C00283', 'Sukkur Electronic', 'Sukkur Electronic', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1823740033', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.578Z', NULL, 0, 0, 1, 'active', 0),
(4040, 'C00284', 'Kabir Brathers', 'Kabir Brathers', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1855585333', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.579Z', NULL, 0, 0, 1, 'active', 0),
(4041, 'C00285', 'Ma Studio', 'Ma Studio', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1824140605', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.579Z', NULL, 0, 0, 1, 'active', 0),
(4042, 'C00286', 'Puspita Telecom', 'Puspita Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1553649361', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.580Z', NULL, 0, 0, 1, 'active', 0),
(4043, 'C00287', 'Amin Telecom', 'Amin Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1531567770', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.581Z', NULL, 0, 0, 1, 'active', 0),
(4044, 'C00288', 'Rofik Telecom', 'Rofik Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1874439090', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.582Z', NULL, 0, 0, 1, 'active', 0),
(4045, 'C00289', 'Mehade Telecom', 'Mehade Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1876608188', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.583Z', NULL, 0, 0, 1, 'active', 0),
(4046, 'C00290', 'Chadga Telecom 2', 'Chadga Telecom 2', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1636518280', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.584Z', NULL, 0, 0, 1, 'active', 0),
(4047, 'C00291', 'Proyjon Telecom', 'Proyjon Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1878748344', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.584Z', NULL, 0, 0, 1, 'active', 0),
(4048, 'C00292', 'Sheikh Farid Telecom', 'Sheikh Farid Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1636518280', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.585Z', NULL, 0, 0, 1, 'active', 0),
(4049, 'C00293', 'Hridoy Telecom', 'Hridoy Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1824218764', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.585Z', NULL, 0, 0, 1, 'active', 0),
(4050, 'C00294', 'Joshim Telecom', 'Joshim Telecom', 'Choto Marung, Dighinala,  Khagrachari', 3130, '1822272126', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.586Z', NULL, 0, 0, 1, 'active', 0),
(4051, 'C00295', 'Aiub Telecom', 'MD Ayub Ali', 'Madhy Boalkhali, Dighinal, Khagrachari', 3138, '1559712345', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.586Z', NULL, 0, 0, 1, 'active', 0),
(4052, 'C00296', 'Ananna Telecom', 'Ananna Telecom', 'Betchari, Dighinala,  Khagrachari', 3126, '1855779776', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.587Z', NULL, 0, 0, 1, 'active', 0),
(4053, 'C00297', 'Jonopriyo Telecom', 'Jonopriyo Telecom', 'Betchari, Dighinala,  Khagrachari', 3126, '1827737715', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.587Z', NULL, 0, 0, 1, 'active', 0),
(4054, 'C00298', 'Rifat Telecom', 'MD Rafiqul Islam Ripon', 'Betchari, Dighinala,  Khagrachari', 3126, '1819846284', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.588Z', NULL, 0, 0, 1, 'active', 0),
(4055, 'C00299', 'Music Zone', 'Ojit Barua', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1556988099', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.588Z', NULL, 0, 0, 1, 'active', 0),
(4056, 'C00300', 'Smart Zone', 'Dipayon Barua', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1835160368', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.589Z', NULL, 0, 0, 1, 'active', 0),
(4057, 'C00301', 'RB Telecom', 'MD Jahidul Islam', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1558918171', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.589Z', NULL, 0, 0, 1, 'active', 0),
(4058, 'C00302', 'AB Telecom', 'MD Halal', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1553004000', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.590Z', NULL, 0, 0, 1, 'active', 0),
(4059, 'C00303', 'Shibly Electronics', 'Dhono Ranjan ', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1501501501', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.590Z', NULL, 0, 0, 1, 'active', 0),
(4060, 'C00304', 'Rakhain Telecom', 'Rakhain Telecom', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1880309191', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.591Z', NULL, 0, 0, 1, 'active', 0),
(4061, 'C00305', 'DR Digital Studio', 'MD Sargent Jafar Iqbal', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1558918055', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.591Z', NULL, 0, 0, 1, 'active', 0),
(4062, 'C00306', 'Salim Telecom', 'MD Salim', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1736279957', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.592Z', NULL, 0, 0, 1, 'active', 0),
(4063, 'C00307', 'Niloy Telecom', 'Niloy Telecom', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1407219475', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.592Z', NULL, 0, 0, 1, 'active', 0),
(4064, 'C00308', 'Joy Electronics', 'Joy Electronics', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1401401401', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.593Z', NULL, 0, 0, 1, 'active', 0),
(4065, 'C00309', 'SS telecom Samsu Vai', 'MD Samsul Alam', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1863233690', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.593Z', NULL, 0, 0, 1, 'active', 0),
(4066, 'C00310', 'SS telecom Shakil', 'MD Sofiqul Islam', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1867134747', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.596Z', NULL, 0, 0, 1, 'active', 0),
(4067, 'C00311', 'Tareng telecom', 'Kosom', 'Boalkhali Natun Bazar, Dighinala, Khagrachari', 3128, '1845773344', '', 0, NULL, 'wholesale', '2021-08-11T18:36:15.596Z', NULL, 0, 0, 1, 'active', 0),
(4068, 'C00004068', 'rffrt', '', '', 3125, '54545', '', 0, 0, 'retail', '2022-03-09T13:18:15.383Z', NULL, 57, 0, 1, 'active', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customer_payments`
--

CREATE TABLE `tbl_customer_payments` (
  `pay_id` int(11) NOT NULL,
  `pay_code` varchar(100) DEFAULT NULL,
  `pay_type` enum('payment','receive') NOT NULL,
  `pay_method` enum('cash','bank','by cheque') NOT NULL,
  `bank_acc_id` int(11) NOT NULL DEFAULT 0,
  `cus_id` int(11) NOT NULL,
  `pay_amount` double NOT NULL,
  `note` text DEFAULT NULL,
  `branch_id` int(11) NOT NULL,
  `previous_due` double NOT NULL DEFAULT 0,
  `created_isodt` varchar(30) NOT NULL,
  `updated_isodt` varchar(30) NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT 0,
  `status` enum('a','d','p') NOT NULL DEFAULT 'a'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_customer_payments`
--

INSERT INTO `tbl_customer_payments` (`pay_id`, `pay_code`, `pay_type`, `pay_method`, `bank_acc_id`, `cus_id`, `pay_amount`, `note`, `branch_id`, `previous_due`, `created_isodt`, `updated_isodt`, `created_by`, `updated_by`, `status`) VALUES
(1, 'CT0001', 'receive', 'bank', 2, 5, 10000, '', 1, 71910, '2021-02-20T14:40:54.865Z', '0', 57, 57, 'a'),
(2, 'CT0002', 'payment', 'cash', 0, 5, 5000, '', 1, 118740, '2021-02-20T14:45:08.185Z', '0', 57, 57, 'a'),
(3, 'CT0003', 'receive', 'cash', 0, 5, 10000, '', 1, 133740, '2021-02-20T14:45:27.559Z', '0', 57, 57, 'a'),
(4, 'CT0004', 'receive', 'cash', 0, 5, 20000, '', 1, 109920, '2021-02-20T14:50:29.585Z', '0', 57, 57, 'a'),
(5, 'CT0005', 'receive', 'cash', 0, 5, 5000, '', 1, 91100, '2021-02-20T15:07:17.123Z', '0', 57, 57, 'a'),
(6, 'CT0006', 'receive', 'cash', 0, 2, 400, '', 1, 2000, '2021-02-20T18:08:18.031Z', '0', 57, 57, 'a'),
(7, 'CT0007', 'receive', 'cash', 0, 2, 300, '', 1, 1600, '2021-02-20T18:08:33.533Z', '0', 57, 57, 'a'),
(8, 'CT0008', 'receive', 'cash', 0, 3, 500, '', 1, 10000, '2021-02-20T18:08:42.857Z', '0', 57, 57, 'a'),
(9, 'CT0009', 'receive', 'cash', 0, 3, 5000, '', 1, 9500, '2021-02-20T18:08:52.900Z', '0', 57, 57, 'a'),
(10, 'CT00010', 'receive', 'cash', 0, 5, 7000, '', 1, 110000, '2021-02-21T00:11:11.670Z', '0', 57, 57, 'a'),
(11, 'CT00011', 'receive', 'cash', 0, 1, 7, '', 1, 5000, '2021-03-26T12:22:01.032Z', '0', 57, 57, 'a'),
(12, 'CT00012', 'receive', 'cash', 0, 12, 200, '', 1, 440, '2021-03-27T06:25:26.307Z', '0', 57, 57, 'a'),
(13, 'CT00013', 'receive', 'cash', 0, 1, 30, '', 1, 4993, '2021-05-21T07:17:16.329Z', '0', 57, 57, 'a'),
(14, 'CT00014', 'receive', 'cash', 0, 3757, 66, '', 1, 0, '2021-11-01T14:30:02.666Z', '0', 57, 57, 'a'),
(15, 'CT00015', 'receive', 'cash', 0, 3759, 200, '', 1, 0, '2022-03-09T13:25:35.800Z', '0', 57, 57, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_departments`
--

CREATE TABLE `tbl_departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `department_created_isodt` varchar(30) NOT NULL,
  `department_updated_isodt` varchar(30) DEFAULT NULL,
  `department_created_by` int(11) NOT NULL,
  `department_updated_by` int(11) NOT NULL DEFAULT 0,
  `department_branch_id` int(11) NOT NULL,
  `department_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_departments`
--

INSERT INTO `tbl_departments` (`department_id`, `department_name`, `department_created_isodt`, `department_updated_isodt`, `department_created_by`, `department_updated_by`, `department_branch_id`, `department_status`) VALUES
(1, 'Production', '2021-02-20T11:37:27.559Z', NULL, 57, 0, 1, 'active'),
(2, 'Sales', '2021-02-20T11:37:34.867Z', NULL, 57, 0, 1, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_designations`
--

CREATE TABLE `tbl_designations` (
  `designation_id` int(11) NOT NULL,
  `designation_name` varchar(255) NOT NULL,
  `designation_created_isodt` varchar(30) NOT NULL,
  `designation_updated_isodt` varchar(30) DEFAULT NULL,
  `designation_created_by` int(11) NOT NULL,
  `designation_updated_by` int(11) NOT NULL DEFAULT 0,
  `designation_branch_id` int(11) NOT NULL,
  `designation_status` enum('active','deactivated','pending') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_designations`
--

INSERT INTO `tbl_designations` (`designation_id`, `designation_name`, `designation_created_isodt`, `designation_updated_isodt`, `designation_created_by`, `designation_updated_by`, `designation_branch_id`, `designation_status`) VALUES
(1, 'Incharge', '2021-02-20T11:35:53.892Z', NULL, 57, 0, 1, 'active'),
(2, 'Sales Man', '2021-02-20T11:37:00.235Z', NULL, 57, 0, 1, 'active'),
(3, 'SR', '2021-03-27T06:47:02.882Z', NULL, 57, 0, 1, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employees`
--

CREATE TABLE `tbl_employees` (
  `employee_id` int(11) NOT NULL,
  `employee_code` varchar(30) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employee_designation_id` int(11) NOT NULL,
  `employee_department_id` int(11) NOT NULL,
  `employee_marital_id` varchar(15) NOT NULL,
  `employee_gender_id` varchar(10) NOT NULL,
  `employee_joining_date` varchar(30) DEFAULT NULL,
  `employee_salary` double NOT NULL,
  `employee_father_name` varchar(255) DEFAULT NULL,
  `employee_mother_name` varchar(255) DEFAULT NULL,
  `employee_date_of_birth` varchar(50) DEFAULT NULL,
  `employee_present_address` text DEFAULT NULL,
  `employee_permanent_address` text DEFAULT NULL,
  `employee_contact_no` varchar(50) DEFAULT NULL,
  `employee_email` varchar(100) DEFAULT NULL,
  `employee_created_isodt` varchar(30) NOT NULL,
  `employee_updated_isodt` varchar(30) DEFAULT NULL,
  `employee_created_by` int(11) NOT NULL,
  `employee_updated_by` int(11) NOT NULL DEFAULT 0,
  `employee_status` enum('active','deactivated','deleted') NOT NULL,
  `employee_branch_id` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_employees`
--

INSERT INTO `tbl_employees` (`employee_id`, `employee_code`, `employee_name`, `employee_designation_id`, `employee_department_id`, `employee_marital_id`, `employee_gender_id`, `employee_joining_date`, `employee_salary`, `employee_father_name`, `employee_mother_name`, `employee_date_of_birth`, `employee_present_address`, `employee_permanent_address`, `employee_contact_no`, `employee_email`, `employee_created_isodt`, `employee_updated_isodt`, `employee_created_by`, `employee_updated_by`, `employee_status`, `employee_branch_id`) VALUES
(1, 'E00001', 'Muhammad Milon', 1, 1, 'Unmarrited', 'Male', '08-09-2018', 30000, 'Md. Habib', 'Most.Ruma', '17-09-1997', 'Mirpur,Dhaka', 'Tangail', '01788888867', '', '2021-02-20T11:43:10.314Z', NULL, 57, 0, 'active', 1),
(2, 'E00002', 'Arif Islam', 2, 2, 'Marrited', 'Male', '05-08-2015', 20000, 'Moli', 'Koli', '03-02-1995', 'Dhaka', '', '', '', '2021-02-20T11:51:52.321Z', NULL, 57, 0, 'active', 1),
(3, 'E00003', 'Roni', 3, 2, 'Marrited', 'Male', '', 10000, '', '', '', '', '', '', '', '2021-03-27T06:47:51.570Z', NULL, 57, 0, 'deactivated', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employee_payments`
--

CREATE TABLE `tbl_employee_payments` (
  `payment_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `month_id` int(11) NOT NULL,
  `payment_isodt` varchar(30) NOT NULL,
  `payment_amount` double NOT NULL DEFAULT 0,
  `deduction_amount` double NOT NULL,
  `payment_note` text DEFAULT NULL,
  `payment_branch_id` int(11) NOT NULL,
  `payable_amount` double NOT NULL DEFAULT 0,
  `bank_acc_id` int(11) NOT NULL,
  `tran_method` enum('cash','bank') NOT NULL DEFAULT 'cash'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_employee_payments`
--

INSERT INTO `tbl_employee_payments` (`payment_id`, `employee_id`, `month_id`, `payment_isodt`, `payment_amount`, `deduction_amount`, `payment_note`, `payment_branch_id`, `payable_amount`, `bank_acc_id`, `tran_method`) VALUES
(1, 2, 2, '2021-02-20T17:49:59.965Z', 10000, 0, 'Salary Advance', 1, 0, 0, 'cash'),
(2, 1, 2, '2021-02-20T17:51:05.340Z', 15000, 0, 'Advance', 1, 0, 0, 'cash'),
(3, 2, 2, '2021-02-20T17:51:45.994Z', 8000, 0, '', 1, 0, 0, 'cash'),
(4, 2, 2, '2021-02-20T17:52:20.684Z', 2000, 0, '', 1, 0, 2, 'bank'),
(5, 1, 2, '2021-02-20T17:52:44.262Z', 10000, 0, '', 1, 0, 2, 'bank'),
(6, 2, 1, '2021-02-20T17:54:39.321Z', 2000, 0, '', 1, 0, 0, 'cash'),
(7, 1, 1, '2021-02-20T17:55:02.812Z', 800, 0, '', 1, 0, 0, 'cash'),
(8, 2, 1, '2021-02-20T17:55:25.135Z', 18000, 0, '', 1, 0, 0, 'cash'),
(9, 2, 3, '2021-03-27T06:35:19.917Z', 10000, 0, '', 1, 0, 0, 'cash');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_institution_profile`
--

CREATE TABLE `tbl_institution_profile` (
  `pro_id` int(11) NOT NULL,
  `pro_name` text NOT NULL,
  `pro_desc` text DEFAULT NULL,
  `pro_logo` text NOT NULL,
  `pro_print_type` enum('a4','pos','1/2a4') NOT NULL DEFAULT 'a4',
  `pro_updated_by` int(11) NOT NULL,
  `pro_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_institution_profile`
--

INSERT INTO `tbl_institution_profile` (`pro_id`, `pro_name`, `pro_desc`, `pro_logo`, `pro_print_type`, `pro_updated_by`, `pro_branch_id`) VALUES
(1, 'Soft Task Ltd', 'Tropical Center 4th Floor,  Elephant Road, Dhaka Bangladesh', '1.png', '1/2a4', 57, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_materials`
--

CREATE TABLE `tbl_materials` (
  `material_id` int(11) NOT NULL,
  `material_code` varchar(100) NOT NULL,
  `material_name_id` int(11) NOT NULL,
  `material_cat_id` int(11) NOT NULL,
  `material_re_order_lebel` int(11) NOT NULL,
  `material_purchase_rate` text DEFAULT NULL,
  `material_unit_id` int(11) NOT NULL,
  `material_status` enum('a','d') NOT NULL,
  `material_created_isodt` varchar(30) NOT NULL,
  `material_updated_isodt` varchar(30) DEFAULT NULL,
  `material_created_by` int(11) NOT NULL,
  `material_updated_by` int(11) DEFAULT NULL,
  `material_branch_ids` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_materials`
--

INSERT INTO `tbl_materials` (`material_id`, `material_code`, `material_name_id`, `material_cat_id`, `material_re_order_lebel`, `material_purchase_rate`, `material_unit_id`, `material_status`, `material_created_isodt`, `material_updated_isodt`, `material_created_by`, `material_updated_by`, `material_branch_ids`) VALUES
(1, 'M00001', 5, 1, 1000, '30', 2, 'a', '2021-02-20T09:34:52.647Z', '2021-02-20T19:56:09.122Z', 57, 57, '1'),
(2, 'M00002', 4, 1, 1000, '20', 3, 'a', '2021-02-20T09:35:06.263Z', '2021-02-20T19:56:03.913Z', 57, 57, '1'),
(3, 'M00003', 3, 1, 300, '0', 3, 'a', '2021-02-20T09:35:28.237Z', NULL, 57, NULL, '1'),
(4, 'M00004', 2, 1, 1200, '2.5', 2, 'a', '2021-02-20T09:36:51.027Z', '2021-02-20T19:56:16.027Z', 57, 57, '1'),
(5, 'M00005', 1, 1, 1000, '200', 1, 'a', '2021-02-20T09:37:43.468Z', '2021-02-20T19:55:59.395Z', 57, 57, '1'),
(6, 'M00006', 6, 7, 0, '0', 1, 'a', '2021-03-27T05:00:48.390Z', '2021-03-27T05:05:09.307Z', 57, 57, '1'),
(7, 'M00007', 7, 7, 0, '0', 1, 'a', '2021-03-27T05:01:14.614Z', NULL, 57, NULL, '1'),
(8, 'M00008', 8, 7, 0, '0', 1, 'a', '2021-03-27T05:01:35.338Z', NULL, 57, NULL, '1'),
(9, 'M00009', 9, 1, 0, '0', 1, 'a', '2021-08-05T20:50:25.677Z', NULL, 57, NULL, '1'),
(10, 'M000010', 10, 1, 0, '0', 1, 'a', '2021-08-07T09:11:37.444Z', NULL, 57, NULL, '1'),
(11, 'M000011', 11, 13, 0, '0', 6, 'a', '2022-02-13T06:01:17.073Z', NULL, 57, NULL, '8'),
(12, 'M000012', 12, 13, 0, '0', 6, 'a', '2022-02-13T06:01:33.793Z', NULL, 57, NULL, '8'),
(13, 'M000013', 13, 13, 0, '0', 7, 'a', '2022-02-13T06:02:26.240Z', NULL, 57, NULL, '8');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_materials_damage`
--

CREATE TABLE `tbl_materials_damage` (
  `damage_id` int(11) NOT NULL,
  `damage_code` varchar(100) NOT NULL,
  `material_id` int(11) NOT NULL,
  `damage_qty` int(11) NOT NULL,
  `damage_rate` int(11) NOT NULL,
  `damage_total` int(11) NOT NULL,
  `damage_note` text DEFAULT NULL,
  `damage_c_isodt` varchar(30) NOT NULL,
  `damage_branch_id` int(11) NOT NULL,
  `damage_user_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_materials_damage`
--

INSERT INTO `tbl_materials_damage` (`damage_id`, `damage_code`, `material_id`, `damage_qty`, `damage_rate`, `damage_total`, `damage_note`, `damage_c_isodt`, `damage_branch_id`, `damage_user_id`) VALUES
(1, 'D0001', 5, 5, 200, 1000, '', '2021-02-20T15:44:26.000Z', 1, 57),
(2, 'D0002', 2, 2, 20, 40, '', '2021-02-20T15:44:32.706Z', 1, 57),
(3, 'D0003', 3, 1, 2, 2, '', '2021-02-20T15:44:39.093Z', 1, 57);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_names`
--

CREATE TABLE `tbl_material_names` (
  `material_name_id` int(11) NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `name_branch_id` int(11) NOT NULL,
  `name_created_by` int(11) NOT NULL,
  `name_created_isodt` varchar(30) NOT NULL,
  `name_updated_isodt` varchar(30) DEFAULT NULL,
  `name_status` enum('a','d','p') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_material_names`
--

INSERT INTO `tbl_material_names` (`material_name_id`, `material_name`, `name_branch_id`, `name_created_by`, `name_created_isodt`, `name_updated_isodt`, `name_status`) VALUES
(1, 'Fevrics', 1, 57, '2021-02-20T09:06:52.644Z', NULL, 'a'),
(2, 'Thread', 1, 57, '2021-02-20T09:08:24.502Z', NULL, 'a'),
(3, 'Button', 1, 57, '2021-02-20T09:09:00.213Z', NULL, 'a'),
(4, 'Zipper', 1, 57, '2021-02-20T09:27:25.091Z', NULL, 'a'),
(5, 'Interlining', 1, 57, '2021-02-20T09:31:24.469Z', NULL, 'a'),
(6, 'oil', 1, 57, '2021-03-27T05:00:28.976Z', NULL, 'a'),
(7, 'Bason', 1, 57, '2021-03-27T05:01:06.766Z', NULL, 'a'),
(8, 'Plat', 1, 57, '2021-03-27T05:01:28.637Z', NULL, 'a'),
(9, 'yaa yaaa', 1, 57, '2021-08-05T20:50:20.539Z', NULL, 'a'),
(10, 'b', 1, 57, '2021-08-07T09:11:34.524Z', NULL, 'a'),
(11, 'Main label', 8, 57, '2022-02-13T06:01:08.060Z', NULL, 'a'),
(12, 'Care Label', 8, 57, '2022-02-13T06:01:26.578Z', NULL, 'a'),
(13, 'Fabrics', 8, 57, '2022-02-13T06:01:46.001Z', NULL, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_purchase`
--

CREATE TABLE `tbl_material_purchase` (
  `m_purchase_id` int(11) NOT NULL,
  `m_purchase_invoice` varchar(100) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `created_isodt` varchar(30) NOT NULL,
  `update_isodt` varchar(30) DEFAULT NULL,
  `branch_id` int(11) NOT NULL,
  `sub_total` double NOT NULL,
  `vat` double NOT NULL,
  `transport_cost` double NOT NULL,
  `discount` double NOT NULL,
  `total` double NOT NULL,
  `paid` double NOT NULL,
  `due` double NOT NULL,
  `note` text DEFAULT NULL,
  `status` enum('a','d','p') NOT NULL,
  `pur_by` int(11) NOT NULL,
  `vat_percent` double NOT NULL,
  `discount_percent` double NOT NULL,
  `previous_due` double NOT NULL,
  `created_by` int(11) NOT NULL,
  `supplier_type` enum('general','reguler') NOT NULL,
  `pay_method` enum('cash','bank') NOT NULL DEFAULT 'cash',
  `bank_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_material_purchase`
--

INSERT INTO `tbl_material_purchase` (`m_purchase_id`, `m_purchase_invoice`, `supplier_id`, `created_isodt`, `update_isodt`, `branch_id`, `sub_total`, `vat`, `transport_cost`, `discount`, `total`, `paid`, `due`, `note`, `status`, `pur_by`, `vat_percent`, `discount_percent`, `previous_due`, `created_by`, `supplier_type`, `pay_method`, `bank_id`) VALUES
(1, 'MINV-2021-1', 10, '2021-02-20T15:33:17.437Z', NULL, 1, 229000, 0, 0, 0, 229000, 0, 229000, '', 'a', 0, 0, 0, 277300, 57, 'reguler', 'cash', 0),
(2, 'MINV-2021-2', 9, '2021-02-20T15:42:17.043Z', NULL, 1, 14404.5, 0, 0, 0, 14404.5, 5000, 9404.5, '', 'a', 0, 0, 0, 121579.23999999999, 57, 'reguler', 'cash', 0),
(3, 'MINV-2021-3', 9, '2021-02-20T16:05:34.850Z', NULL, 1, 3445, 0, 0, 0, 3445, 3000, 445, '', 'a', 2, 0, 0, 130983.73999999999, 57, 'reguler', 'cash', 0),
(4, 'MINV-2021-4', 9, '2021-02-20T16:22:43.266Z', NULL, 1, 920, 0, 0, 0, 920, 100, 820, '', 'a', 0, 0, 0, 131428.74, 57, 'reguler', 'cash', 0),
(5, 'MINV-2021-5', 9, '2021-02-20T16:23:39.009Z', NULL, 1, 2475, 0, 0, 0, 2475, 2000, 475, '', 'a', 0, 0, 0, 132248.74, 57, 'reguler', 'cash', 0),
(6, 'MINV-2021-6', 10, '2021-02-20T22:10:18.649Z', NULL, 1, 15115, 0, 0, 0, 15115, 500, 14615, '', 'a', 0, 0, 0, 507230, 57, 'reguler', 'bank', 1),
(7, 'MINV-2021-7', 10, '2021-03-21T18:25:11.288Z', NULL, 1, 80, 0, 0, 0, 80, 0, 80, '', 'a', 0, 0, 0, 522094.30000000005, 57, 'reguler', 'cash', 0),
(8, 'MINV-2021-8', 115, '2021-03-27T05:05:17.578Z', NULL, 1, 29005, 0, 2000, 0, 31005, 30000, 1005, '', 'a', 0, 0, 0, 0, 57, 'reguler', 'cash', 0),
(9, 'MINV-2021-9', 115, '2021-03-27T05:14:04.647Z', NULL, 1, 1000, 0, 0, 0, 1000, 500, 500, '', 'a', 0, 0, 0, 1005, 57, 'reguler', 'cash', 0),
(10, 'MINV-2021-10', 303, '2021-08-05T20:50:31.054Z', NULL, 1, 80, 0, 0, 0, 80, 5000, -4920, '', 'a', 0, 0, 0, 0, 57, 'general', 'cash', 0),
(11, 'MINV-2021-11', 304, '2021-08-05T20:52:15.602Z', NULL, 1, 2500, 0, 0, 0, 2500, 2500, 0, '', 'd', 0, 0, 0, 0, 57, 'general', 'cash', 0),
(12, 'MINV-2021-12', 136, '2021-08-07T09:11:40.871Z', NULL, 1, 10, 0, 0, 0, 10, 0, 10, '', 'a', 0, 0, 0, 76, 57, 'reguler', 'cash', 0),
(13, 'MINV-2021-13', 136, '2021-08-07T09:11:51.961Z', NULL, 1, 12, 0, 0, 0, 12, 0, 12, '', 'a', 0, 0, 0, 0, 57, 'reguler', 'cash', 0),
(14, 'MINV-2022-14', 326, '2022-02-13T06:04:10.866Z', NULL, 8, 38400, 0, 0, 0, 38400, 20000, 18400, '', 'a', 0, 0, 0, 0, 57, 'reguler', 'cash', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_purchase_details`
--

CREATE TABLE `tbl_material_purchase_details` (
  `m_pur_detail_id` int(11) NOT NULL,
  `m_purchase_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `purchase_rate` double NOT NULL,
  `purchase_qty` double NOT NULL,
  `purchase_total` double NOT NULL,
  `status` enum('a','d','p') NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_material_purchase_details`
--

INSERT INTO `tbl_material_purchase_details` (`m_pur_detail_id`, `m_purchase_id`, `material_id`, `purchase_rate`, `purchase_qty`, `purchase_total`, `status`, `branch_id`) VALUES
(1, 1, 5, 200, 300, 60000, 'a', 1),
(2, 1, 2, 20, 500, 10000, 'a', 1),
(3, 1, 1, 30, 1000, 30000, 'a', 1),
(4, 1, 3, 2, 2000, 4000, 'a', 1),
(5, 1, 4, 2.5, 50000, 125000, 'a', 1),
(6, 2, 5, 200, 54, 10800, 'a', 1),
(7, 2, 2, 20, 33, 660, 'a', 1),
(8, 2, 1, 30, 66, 1980, 'a', 1),
(9, 2, 3, 2, 66, 132, 'a', 1),
(10, 2, 4, 2.5, 333, 832.5, 'a', 1),
(11, 3, 5, 200, 6, 1200, 'a', 1),
(12, 3, 2, 20, 8, 160, 'a', 1),
(13, 3, 1, 30, 60, 1800, 'a', 1),
(14, 3, 3, 2, 60, 120, 'a', 1),
(15, 3, 4, 2.5, 66, 165, 'a', 1),
(19, 4, 3, 2, 60, 120, 'a', 1),
(18, 4, 5, 200, 4, 800, 'a', 1),
(20, 5, 2, 20, 55, 1100, 'a', 1),
(21, 5, 4, 2.5, 550, 1375, 'a', 1),
(22, 6, 2, 20, 5, 100, 'a', 1),
(23, 6, 4, 2.5, 6, 15, 'a', 1),
(24, 6, 1, 30, 500, 15000, 'a', 1),
(25, 7, 2, 20, 4, 80, 'a', 1),
(26, 8, 6, 113, 185, 20905, 'a', 1),
(27, 8, 8, 40, 150, 6000, 'a', 1),
(28, 8, 7, 42, 50, 2100, 'a', 1),
(29, 9, 6, 100, 10, 1000, 'a', 1),
(31, 10, 2, 20, 4, 80, 'a', 1),
(32, 11, 9, 500, 5, 2500, 'd', 1),
(33, 12, 10, 10, 1, 10, 'a', 1),
(35, 13, 10, 12, 1, 12, 'a', 1),
(36, 14, 11, 1.2, 2000, 2400, 'a', 8),
(37, 14, 12, 0.5, 2000, 1000, 'a', 8),
(38, 14, 13, 350, 100, 35000, 'a', 8);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_purchase_rate`
--

CREATE TABLE `tbl_material_purchase_rate` (
  `material_purchase_rate_id` int(11) NOT NULL,
  `material_avarage_rate` text DEFAULT NULL,
  `material_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_material_purchase_rate`
--

INSERT INTO `tbl_material_purchase_rate` (`material_purchase_rate_id`, `material_avarage_rate`, `material_id`, `branch_id`) VALUES
(1, '200', 5, 1),
(2, '20', 2, 1),
(3, '30', 1, 1),
(4, '2', 3, 1),
(5, '2.5', 4, 1),
(6, '112.33333333333333', 6, 1),
(7, '40', 8, 1),
(8, '42', 7, 1),
(9, '500', 9, 1),
(10, '11', 10, 1),
(11, '1.2', 11, 8),
(12, '0.5', 12, 8),
(13, '350', 13, 8);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_stock`
--

CREATE TABLE `tbl_material_stock` (
  `stock_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `material_purchase_qty` double NOT NULL DEFAULT 0,
  `material_used_qty` double NOT NULL DEFAULT 0,
  `material_damage_qty` double NOT NULL DEFAULT 0,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_material_stock`
--

INSERT INTO `tbl_material_stock` (`stock_id`, `material_id`, `material_purchase_qty`, `material_used_qty`, `material_damage_qty`, `branch_id`) VALUES
(34, 10, 2, 0, 0, 1),
(33, 9, 0, 0, 0, 1),
(32, 7, 50, 10, 0, 1),
(31, 8, 150, 50, 0, 1),
(30, 6, 195, 10, 0, 1),
(29, 4, 50955, 24160, 0, 1),
(28, 3, 2186, 1380, 1, 1),
(27, 1, 1626, 290, 0, 1),
(26, 2, 609, 160, 2, 1),
(25, 5, 364, 85, 5, 1),
(35, 11, 2000, 0, 0, 8),
(36, 12, 2000, 0, 0, 8),
(37, 13, 100, 0, 0, 8);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_months`
--

CREATE TABLE `tbl_months` (
  `month_id` int(11) NOT NULL,
  `month_name` varchar(255) NOT NULL,
  `month_created_isodt` varchar(30) NOT NULL,
  `month_updated_isodt` varchar(30) DEFAULT NULL,
  `month_created_by` int(11) NOT NULL,
  `month_updated_by` int(11) NOT NULL DEFAULT 0,
  `month_branch_id` int(11) NOT NULL,
  `month_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_months`
--

INSERT INTO `tbl_months` (`month_id`, `month_name`, `month_created_isodt`, `month_updated_isodt`, `month_created_by`, `month_updated_by`, `month_branch_id`, `month_status`) VALUES
(1, 'January 2021', '2021-02-20T11:39:54.395Z', NULL, 57, 0, 1, 'active'),
(2, 'February 2021', '2021-02-20T11:40:05.912Z', NULL, 57, 0, 1, 'active'),
(3, 'March 2021', '2021-02-20T11:40:17.552Z', NULL, 57, 0, 1, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_production_products`
--

CREATE TABLE `tbl_production_products` (
  `prod_d_id` int(11) NOT NULL,
  `prod_id` int(11) NOT NULL,
  `production_id` int(11) NOT NULL,
  `prod_qty` double NOT NULL,
  `prod_rate` double NOT NULL,
  `prod_total` double NOT NULL,
  `prod_status` enum('a','d','p') NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_production_products`
--

INSERT INTO `tbl_production_products` (`prod_d_id`, `prod_id`, `production_id`, `prod_qty`, `prod_rate`, `prod_total`, `prod_status`, `branch_id`) VALUES
(1, 2, 1, 100, 566, 56600, 'a', 1),
(2, 2, 2, 4, 408, 1632, 'a', 1),
(4, 1, 3, 100, 428, 42800, 'a', 1),
(5, 1, 4, 5, 459.2, 2296, 'a', 1),
(6, 1, 5, 20, 334.1, 6682, 'a', 1),
(9, 1, 6, 50, 379, 18950, 'a', 1),
(10, 8, 7, 5, 49.86, 249.3, 'a', 1),
(11, 14, 8, 5000, 1.11866, 5593.3, 'a', 1),
(12, 33, 9, 20, 500, 10000, 'd', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `prod_id` int(11) NOT NULL,
  `prod_cat_id` int(11) NOT NULL DEFAULT 0,
  `prod_brand_id` int(11) NOT NULL DEFAULT 0,
  `prod_size_id` int(11) NOT NULL DEFAULT 0,
  `prod_color_id` int(11) NOT NULL DEFAULT 0,
  `prod_name_id` int(11) NOT NULL DEFAULT 0,
  `prod_unit_id` int(11) NOT NULL DEFAULT 0,
  `prod_code` varchar(255) NOT NULL,
  `prod_branch_ids` text DEFAULT NULL,
  `prod_purchase_rate` text DEFAULT NULL,
  `prod_sale_rate` double NOT NULL DEFAULT 0,
  `prod_whole_sale_rate` double NOT NULL DEFAULT 0,
  `prod_vat` double NOT NULL DEFAULT 0,
  `prod_re_order_lebel` int(11) NOT NULL DEFAULT 0,
  `prod_is_service` enum('true','false') NOT NULL DEFAULT 'false',
  `prod_created_isodt` varchar(30) NOT NULL,
  `prod_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_created_by` int(11) NOT NULL,
  `prod_updated_by` int(11) DEFAULT NULL,
  `prod_status` enum('active','deactivated','deleted') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`prod_id`, `prod_cat_id`, `prod_brand_id`, `prod_size_id`, `prod_color_id`, `prod_name_id`, `prod_unit_id`, `prod_code`, `prod_branch_ids`, `prod_purchase_rate`, `prod_sale_rate`, `prod_whole_sale_rate`, `prod_vat`, `prod_re_order_lebel`, `prod_is_service`, `prod_created_isodt`, `prod_updated_isodt`, `prod_created_by`, `prod_updated_by`, `prod_status`) VALUES
(15, 2, 0, 0, 0, 1, 1, 'P00001', '1', '0', 0, 0, 0, 0, 'false', '2021-06-25T14:56:50.570Z', '2021-06-25T14:56:50.570Z', 57, 57, 'deactivated'),
(16, 1, 0, 0, 0, 4, 1, 'P000016', '1', '0', 0, 0, 0, 0, 'false', '2021-06-25T14:56:57.973Z', '2021-06-25T14:56:57.973Z', 57, 57, 'deactivated'),
(17, 2, 0, 0, 0, 3, 3, 'P000017', '1', '0', 0, 0, 0, 0, 'false', '2021-06-20T08:24:29.939Z', '2021-06-20T08:24:29.939Z', 57, 57, 'deactivated'),
(18, 2, 0, 0, 0, 15, 2, 'P000018', '1', '0', 0, 0, 0, 0, 'false', '2021-06-20T07:29:38.551Z', NULL, 57, NULL, 'deactivated'),
(19, 7, 0, 0, 0, 15, 1, 'P000019', '1', '0', 0, 0, 0, 0, 'false', '2021-06-20T07:31:32.500Z', NULL, 57, NULL, 'deactivated'),
(20, 6, 0, 0, 0, 15, 3, 'P000020', '1', '0', 0, 0, 0, 0, 'false', '2021-06-20T07:32:23.910Z', NULL, 57, NULL, 'deactivated'),
(21, 8, 0, 0, 0, 17, 3, 'P000021', '1', '0', 0, 0, 0, 0, 'false', '2021-06-25T14:57:02.884Z', '2021-06-25T14:57:02.884Z', 57, 57, 'deactivated'),
(22, 8, 0, 0, 0, 18, 5, 'P000022', '1', '55', 0, 0, 0, 0, 'false', '2021-06-25T14:56:45.561Z', '2021-06-25T14:56:45.561Z', 57, 57, 'deactivated'),
(23, 1, 0, 0, 0, 19, 3, 'P000023', '1', '0', 0, 0, 0, 0, 'false', '2021-06-25T14:58:00.560Z', NULL, 57, NULL, 'deactivated'),
(24, 9, 0, 0, 0, 20, 3, 'P000024', '1', '600', 550, 0, 0, 0, 'false', '2021-08-24T08:55:51.806Z', '2021-08-24T08:55:51.806Z', 57, 57, 'active'),
(25, 9, 0, 0, 0, 23, 3, 'P000025', '1', '0', 0, 0, 0, 0, 'false', '2021-06-26T06:52:37.068Z', NULL, 57, NULL, 'active'),
(26, 9, 0, 0, 0, 22, 3, 'P000026', '1', '0', 0, 0, 0, 0, 'false', '2021-06-26T06:52:43.841Z', NULL, 57, NULL, 'active'),
(27, 9, 0, 0, 0, 21, 3, 'P000027', '1', '0', 0, 0, 0, 0, 'false', '2021-06-26T06:52:59.666Z', NULL, 57, NULL, 'active'),
(28, 1, 0, 0, 0, 24, 1, 'P000028', '1', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:46:27.766Z', NULL, 57, NULL, 'active'),
(29, 1, 0, 0, 0, 25, 1, 'P000029', '1', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:48:54.422Z', NULL, 57, NULL, 'active'),
(30, 10, 0, 0, 0, 29, 1, 'P000030', '1,7', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:52:42.193Z', NULL, 57, NULL, 'active'),
(31, 10, 0, 0, 0, 28, 1, 'P000031', '1', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:52:48.753Z', NULL, 57, NULL, 'active'),
(32, 10, 0, 0, 0, 27, 1, 'P000032', '1', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:52:54.294Z', NULL, 57, NULL, 'active'),
(33, 10, 0, 0, 0, 26, 1, 'P000033', '1,7', '0', 0, 0, 0, 0, 'false', '2021-08-05T15:53:00.002Z', NULL, 57, NULL, 'active'),
(34, 1, 0, 0, 0, 30, 3, 'P000034', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T07:37:08.477Z', NULL, 57, NULL, 'active'),
(35, 12, 0, 0, 0, 31, 3, 'P000035', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T07:48:10.968Z', NULL, 57, NULL, 'active'),
(36, 1, 0, 0, 0, 32, 1, 'P000036', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T08:26:10.887Z', NULL, 57, NULL, 'active'),
(37, 1, 0, 0, 0, 33, 1, 'P000037', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T08:34:27.676Z', NULL, 57, NULL, 'active'),
(38, 1, 0, 0, 0, 34, 3, 'P000038', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T08:44:14.569Z', NULL, 57, NULL, 'active'),
(39, 1, 0, 0, 0, 35, 2, 'P000039', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T09:08:38.283Z', NULL, 57, NULL, 'active'),
(40, 1, 0, 0, 0, 36, 1, 'P000040', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T09:37:38.008Z', NULL, 57, NULL, 'active'),
(41, 1, 0, 0, 0, 37, 1, 'P000041', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T10:49:23.464Z', NULL, 57, NULL, 'active'),
(42, 1, 0, 0, 0, 38, 1, 'P000042', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T10:55:16.898Z', NULL, 57, NULL, 'active'),
(43, 1, 0, 0, 0, 39, 1, 'P000043', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T10:59:50.754Z', NULL, 57, NULL, 'active'),
(44, 1, 0, 0, 0, 40, 1, 'P000044', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T11:29:44.237Z', NULL, 57, NULL, 'active'),
(45, 1, 0, 0, 0, 41, 3, 'P000045', '1', '0', 0, 0, 0, 0, 'false', '2021-08-07T12:30:47.920Z', NULL, 57, NULL, 'active'),
(46, 1, 0, 0, 0, 1, 2, 'gggf', '1', '0', 0, 0, 0, 0, 'false', '2021-08-24T08:52:32.575Z', NULL, 57, NULL, 'active'),
(47, 3, 0, 0, 0, 1, 3, 'dfsdf', '1', '0', 0, 0, 0, 0, 'false', '2021-08-24T08:53:51.803Z', NULL, 57, NULL, 'active'),
(48, 4, 0, 0, 0, 1, 2, 'fffg', '1', '0', 0, 0, 0, 0, 'false', '2021-08-24T08:54:49.671Z', '2021-08-24T08:54:49.671Z', 57, 57, 'active'),
(49, 5, 0, 0, 0, 1, 2, 'dsds', '1', '0', 0, 0, 0, 0, 'false', '2021-08-24T08:56:00.156Z', NULL, 57, NULL, 'active'),
(50, 6, 0, 0, 0, 1, 2, '66667', '1', '0', 0, 0, 0, 0, 'false', '2021-09-02T12:02:07.083Z', '2021-09-02T12:02:07.083Z', 57, 57, 'active'),
(51, 10, 0, 0, 0, 1, 2, '66667', '1', '0', 0, 0, 0, 0, 'false', '2021-09-02T12:02:23.214Z', NULL, 57, NULL, 'active'),
(52, 2, 0, 0, 0, 8, 3, 'P000052', '1', '0', 0, 0, 0, 0, 'false', '2021-09-06T12:18:17.311Z', NULL, 57, NULL, 'active'),
(53, 7, 0, 0, 0, 1, 2, 'P000053', '1', '0', 0, 0, 0, 0, 'false', '2021-09-06T12:19:36.690Z', NULL, 57, NULL, 'active'),
(54, 1, 0, 0, 0, 42, 3, 'P000054', '1', '0', 0, 0, 0, 0, 'false', '2021-09-25T12:51:24.386Z', NULL, 57, NULL, 'active'),
(55, 1, 0, 0, 0, 7, 3, 'P000055e', '1', '0', 0, 0, 0, 0, 'false', '2021-09-25T12:52:48.761Z', '2021-09-25T12:52:48.761Z', 57, 57, 'active'),
(56, 2, 0, 0, 0, 6, 3, 'P0000564444', '1', '0', 0, 0, 0, 0, 'false', '2021-09-25T12:53:00.914Z', NULL, 57, NULL, 'active'),
(57, 13, 0, 0, 0, 43, 6, 'P000057', '8', '0', 0, 0, 0, 0, 'false', '2022-02-13T06:03:01.755Z', NULL, 57, NULL, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products_names`
--

CREATE TABLE `tbl_products_names` (
  `prod_name_id` int(11) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_name_created_isodt` varchar(30) DEFAULT NULL,
  `prod_name_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_name_created_by` int(11) NOT NULL DEFAULT 0,
  `prod_name_updated_by` int(11) NOT NULL DEFAULT 0,
  `prod_name_branch_id` int(11) NOT NULL DEFAULT 0,
  `prod_name_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_products_names`
--

INSERT INTO `tbl_products_names` (`prod_name_id`, `prod_name`, `prod_name_created_isodt`, `prod_name_updated_isodt`, `prod_name_created_by`, `prod_name_updated_by`, `prod_name_branch_id`, `prod_name_status`) VALUES
(1, 'Shirt', '2021-02-20T09:40:05.327Z', NULL, 57, 0, 1, 'active'),
(2, 'Pant', '2021-02-20T09:40:42.310Z', NULL, 57, 0, 1, 'active'),
(3, 'Oppo F17 Pro', '2021-02-20T12:04:39.036Z', NULL, 57, 0, 1, 'active'),
(4, 'Realme 7i', '2021-02-20T12:05:32.928Z', NULL, 57, 0, 1, 'active'),
(5, 'Samsung Galaxy M02s', '2021-02-20T12:08:47.980Z', NULL, 57, 0, 1, 'active'),
(6, 'Chinigura Rice', '2021-02-20T12:12:06.442Z', NULL, 57, 0, 1, 'active'),
(7, 'Miniket Rice', '2021-02-20T12:13:19.449Z', NULL, 57, 0, 1, 'active'),
(8, 'Atop Rice', '2021-02-20T12:14:55.191Z', NULL, 57, 0, 1, 'active'),
(9, 'Cute Cold Cream 100 gm', '2021-02-20T12:21:15.394Z', '2021-02-20T12:22:26.085Z', 57, 57, 1, 'active'),
(10, 'Pond\'s Day Cream 35 gm', '2021-02-20T12:23:25.877Z', '2021-02-20T12:23:49.993Z', 57, 57, 1, 'active'),
(11, 'Pusti Soyabean Oil', '2021-02-20T12:26:08.462Z', NULL, 57, 0, 1, 'active'),
(12, 'Fresh Soyabean Oil', '2021-02-20T12:28:10.159Z', NULL, 57, 0, 1, 'active'),
(13, 'cute', '2021-02-22T13:58:47.702Z', NULL, 57, 0, 1, 'active'),
(14, 'Chips', '2021-03-27T05:19:06.944Z', NULL, 57, 0, 1, 'active'),
(15, 'd', '2021-06-20T07:28:14.044Z', NULL, 57, 0, 1, 'active'),
(16, 'app', '2021-06-20T08:24:52.774Z', NULL, 57, 0, 1, 'active'),
(17, 'Printing', '2021-06-23T05:55:56.116Z', NULL, 57, 0, 1, 'active'),
(18, 'A4 Paper', '2021-06-23T05:58:24.297Z', NULL, 57, 0, 1, 'active'),
(19, 'three pic', '2021-06-25T14:57:55.499Z', NULL, 57, 0, 1, 'active'),
(20, 'Metter', '2021-06-26T06:49:50.208Z', NULL, 57, 0, 1, 'active'),
(21, '50 vail', '2021-06-26T06:50:55.527Z', NULL, 57, 0, 1, 'active'),
(22, '(25*2) = 50 pcs', '2021-06-26T06:51:53.746Z', NULL, 57, 0, 1, 'active'),
(23, 'Single Strips 50 pcs (1 box)', '2021-06-26T06:52:31.053Z', NULL, 57, 0, 1, 'active'),
(24, 'gg', '2021-08-05T15:46:22.662Z', NULL, 57, 0, 1, 'active'),
(25, 'aaa', '2021-08-05T15:48:49.745Z', NULL, 57, 0, 1, 'active'),
(26, 'king cem', '2021-08-05T15:51:01.626Z', NULL, 57, 0, 1, 'active'),
(27, 'seven cem', '2021-08-05T15:51:25.694Z', NULL, 57, 0, 1, 'active'),
(28, 'shah cem', '2021-08-05T15:51:44.479Z', NULL, 57, 0, 1, 'active'),
(29, 'megna cem', '2021-08-05T15:52:08.907Z', NULL, 57, 0, 1, 'active'),
(30, 'news', '2021-08-07T07:37:03.464Z', NULL, 57, 0, 1, 'active'),
(31, 'test2', '2021-08-07T07:47:48.176Z', NULL, 57, 0, 1, 'active'),
(32, 't', '2021-08-07T08:26:05.643Z', NULL, 57, 0, 1, 'active'),
(33, 'c', '2021-08-07T08:34:22.464Z', NULL, 57, 0, 1, 'active'),
(34, 'b', '2021-08-07T08:44:08.569Z', NULL, 57, 0, 1, 'active'),
(35, 'bd', '2021-08-07T09:08:32.841Z', NULL, 57, 0, 1, 'active'),
(36, 'bbbbb', '2021-08-07T09:37:34.413Z', NULL, 57, 0, 1, 'active'),
(37, '1', '2021-08-07T10:49:19.483Z', NULL, 57, 0, 1, 'active'),
(38, '2', '2021-08-07T10:55:12.692Z', NULL, 57, 0, 1, 'active'),
(39, '3', '2021-08-07T10:59:46.642Z', NULL, 57, 0, 1, 'active'),
(40, '4', '2021-08-07T11:29:39.435Z', NULL, 57, 0, 1, 'active'),
(41, 'ne', '2021-08-07T12:30:44.456Z', NULL, 57, 0, 1, 'active'),
(42, 'dddd', '2021-09-25T12:51:18.306Z', NULL, 57, 0, 1, 'active'),
(43, 'T- shirt', '2022-02-13T06:02:56.679Z', NULL, 57, 0, 8, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_brands`
--

CREATE TABLE `tbl_product_brands` (
  `prod_brand_id` int(11) NOT NULL,
  `prod_brand_name` varchar(255) NOT NULL,
  `prod_brand_created_isodt` varchar(30) DEFAULT NULL,
  `prod_brand_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_brand_created_by` int(11) NOT NULL DEFAULT 0,
  `prod_brand_updated_by` int(11) NOT NULL DEFAULT 0,
  `prod_brand_branch_id` int(11) NOT NULL,
  `prod_brand_status` enum('active','deactivated','pending') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_categories`
--

CREATE TABLE `tbl_product_categories` (
  `prod_cat_id` int(11) NOT NULL,
  `prod_cat_name` varchar(255) DEFAULT NULL,
  `prod_cat_created_isodt` varchar(30) DEFAULT NULL,
  `prod_cat_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_cat_branch_id` int(11) NOT NULL,
  `prod_cat_created_by` int(11) NOT NULL,
  `prod_cat_updated_by` int(11) NOT NULL,
  `prod_cat_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_categories`
--

INSERT INTO `tbl_product_categories` (`prod_cat_id`, `prod_cat_name`, `prod_cat_created_isodt`, `prod_cat_updated_isodt`, `prod_cat_branch_id`, `prod_cat_created_by`, `prod_cat_updated_by`, `prod_cat_status`) VALUES
(1, 'Garments', '2021-02-20T09:14:18.844Z', NULL, 1, 57, 57, 'active'),
(2, 'Mobile', '2021-02-20T11:56:53.246Z', NULL, 1, 57, 57, 'active'),
(3, 'Notebook', '2021-02-20T11:57:38.657Z', NULL, 1, 57, 57, 'active'),
(4, 'Rice', '2021-02-20T12:11:52.938Z', NULL, 1, 57, 57, 'active'),
(5, 'Beauty & Health', '2021-02-20T12:20:13.394Z', NULL, 1, 57, 57, 'active'),
(6, 'Cooking', '2021-02-20T12:25:57.114Z', NULL, 1, 57, 57, 'active'),
(7, 'Food', '2021-03-27T05:00:13.779Z', NULL, 1, 57, 57, 'active'),
(8, 'Service', '2021-06-23T05:56:02.445Z', NULL, 1, 57, 57, 'active'),
(9, 'Medicine', '2021-06-26T06:49:38.112Z', NULL, 1, 57, 57, 'active'),
(10, 'cement', '2021-08-05T15:50:45.489Z', NULL, 1, 57, 57, 'active'),
(11, 'rrr', '2021-08-05T20:45:49.980Z', NULL, 7, 57, 57, 'active'),
(12, 'test', '2021-08-07T07:47:04.145Z', NULL, 1, 57, 57, 'active'),
(13, 'E', '2022-02-13T06:00:53.076Z', NULL, 8, 57, 57, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_colors`
--

CREATE TABLE `tbl_product_colors` (
  `prod_color_id` int(11) NOT NULL,
  `prod_color_name` varchar(255) NOT NULL,
  `prod_color_created_isodt` varchar(30) DEFAULT NULL,
  `prod_color_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_color_created_by` int(11) NOT NULL DEFAULT 0,
  `prod_color_updated_by` int(11) NOT NULL DEFAULT 0,
  `prod_color_branch_id` int(11) NOT NULL,
  `prod_color_status` enum('active','deactivated','pending') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_current_stock`
--

CREATE TABLE `tbl_product_current_stock` (
  `stock_id` int(11) NOT NULL,
  `purchase_qty` double NOT NULL DEFAULT 0,
  `purchase_return_qty` double NOT NULL DEFAULT 0,
  `production_qty` double NOT NULL DEFAULT 0,
  `sale_qty` double NOT NULL DEFAULT 0,
  `sale_return_qty` double NOT NULL DEFAULT 0,
  `damage_qty` double NOT NULL DEFAULT 0,
  `transfer_from_qty` double NOT NULL DEFAULT 0,
  `transfer_to_qty` double NOT NULL DEFAULT 0,
  `prod_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_current_stock`
--

INSERT INTO `tbl_product_current_stock` (`stock_id`, `purchase_qty`, `purchase_return_qty`, `production_qty`, `sale_qty`, `sale_return_qty`, `damage_qty`, `transfer_from_qty`, `transfer_to_qty`, `prod_id`, `branch_id`) VALUES
(48, 0, 0, 0, 0, 0, 0, 0, 0, 31, 1),
(47, 0, 0, 0, 0, 0, 0, 0, 0, 32, 1),
(46, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1),
(45, 0, 0, 0, 0, 0, 0, 0, 0, 33, 1),
(50, 0, 0, 0, 0, 0, 0, 0, 0, 33, 7),
(51, 0, 0, 0, 0, 0, 0, 0, 0, 30, 7),
(52, 0, 0, 0, 0, 0, 0, 0, 0, 34, 1),
(53, 0, 0, 0, 0, 0, 0, 0, 0, 35, 1),
(54, 0, 0, 0, 0, 0, 0, 0, 0, 36, 1),
(55, 0, 0, 0, 0, 0, 0, 0, 0, 37, 1),
(56, 0, 0, 0, 0, 0, 0, 0, 0, 38, 1),
(57, 0, 0, 0, 0, 0, 0, 0, 0, 39, 1),
(58, 0, 0, 0, 0, 0, 0, 0, 0, 40, 1),
(59, 33, 0, 0, 0, 0, 0, 0, 0, 41, 1),
(60, 33, 0, 0, 13, 0, 0, 0, 0, 42, 1),
(61, 0, 0, 0, 0, 0, 0, 0, 0, 43, 1),
(62, 0, 0, 0, 0, 0, 0, 0, 0, 27, 1),
(63, 0, 0, 0, 0, 0, 0, 0, 0, 44, 1),
(64, 2, 2, 0, 0, 0, 0, 0, 0, 45, 1),
(65, 37, 2, 0, 13, 1, 0, 0, 0, 26, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_damage`
--

CREATE TABLE `tbl_product_damage` (
  `damage_id` int(11) NOT NULL,
  `damage_code` varchar(100) NOT NULL,
  `damage_prod_id` int(11) NOT NULL,
  `damage_rate` double NOT NULL,
  `damage_qty` int(11) NOT NULL,
  `damage_total` double NOT NULL,
  `damage_note` text DEFAULT NULL,
  `damage_user_id` int(11) NOT NULL,
  `damage_branch_id` int(11) NOT NULL,
  `damage_c_isodt` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_damage`
--

INSERT INTO `tbl_product_damage` (`damage_id`, `damage_code`, `damage_prod_id`, `damage_rate`, `damage_qty`, `damage_total`, `damage_note`, `damage_user_id`, `damage_branch_id`, `damage_c_isodt`) VALUES
(2, 'D0001', 9, 80, 1, 80, '', 57, 1, '2021-02-20T15:46:22.441Z'),
(3, 'D0003', 2, 796, 2, 1592, '', 57, 1, '2021-02-20T15:46:27.957Z'),
(4, 'D0004', 5, 9500, 1, 9500, '', 57, 1, '2021-02-20T15:46:38.339Z'),
(5, 'D0005', 9, 80, 10, 800, '', 57, 1, '2021-02-20T15:46:49.597Z'),
(6, 'D0006', 2, 796, 5, 3980, '', 57, 1, '2021-02-20T15:47:00.180Z'),
(7, 'D0007', 12, 100, 3, 300, '', 57, 1, '2021-02-20T15:47:12.202Z'),
(8, 'D0008', 14, 1.11866, 12, 13.423919999999999, '', 57, 1, '2021-03-27T06:32:09.250Z');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_productions_details`
--

CREATE TABLE `tbl_product_productions_details` (
  `prod_d_id` int(11) NOT NULL,
  `production_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `material_qty` int(11) NOT NULL,
  `material_rate` int(11) NOT NULL,
  `material_total` int(11) NOT NULL,
  `status` enum('a','d','p') NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_productions_details`
--

INSERT INTO `tbl_product_productions_details` (`prod_d_id`, `production_id`, `material_id`, `material_qty`, `material_rate`, `material_total`, `status`, `branch_id`) VALUES
(1, 1, 5, 25, 200, 5000, 'a', 1),
(2, 1, 2, 100, 20, 2000, 'a', 1),
(3, 1, 1, 100, 30, 3000, 'a', 1),
(4, 1, 3, 800, 2, 1600, 'a', 1),
(5, 1, 4, 8000, 3, 20000, 'a', 1),
(6, 2, 5, 4, 200, 800, 'a', 1),
(7, 2, 2, 4, 20, 80, 'a', 1),
(8, 2, 1, 4, 30, 120, 'a', 1),
(9, 2, 3, 16, 2, 32, 'a', 1),
(10, 2, 4, 160, 3, 400, 'a', 1),
(18, 3, 4, 10000, 3, 25000, 'a', 1),
(17, 3, 3, 100, 2, 200, 'a', 1),
(16, 3, 1, 120, 30, 3600, 'a', 1),
(15, 3, 5, 30, 200, 6000, 'a', 1),
(19, 4, 5, 4, 200, 800, 'a', 1),
(20, 4, 1, 6, 30, 180, 'a', 1),
(21, 4, 3, 8, 2, 16, 'a', 1),
(22, 4, 4, 400, 3, 1000, 'a', 1),
(23, 5, 5, 6, 200, 1200, 'a', 1),
(24, 5, 2, 6, 20, 120, 'a', 1),
(25, 5, 1, 5, 30, 150, 'a', 1),
(26, 5, 3, 6, 2, 12, 'a', 1),
(27, 5, 4, 1600, 3, 4000, 'a', 1),
(42, 6, 5, 12, 200, 2400, 'a', 1),
(41, 6, 2, 50, 20, 1000, 'a', 1),
(40, 6, 1, 55, 30, 1650, 'a', 1),
(39, 6, 3, 450, 2, 900, 'a', 1),
(38, 6, 4, 4000, 3, 10000, 'a', 1),
(43, 7, 5, 4, 200, 800, 'a', 1),
(44, 8, 6, 10, 112, 1123, 'a', 1),
(45, 8, 8, 50, 40, 2000, 'a', 1),
(46, 8, 7, 10, 42, 420, 'a', 1),
(47, 9, 5, 4, 200, 800, 'd', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_productions_master`
--

CREATE TABLE `tbl_product_productions_master` (
  `production_id` int(11) NOT NULL,
  `production_invoice` varchar(100) NOT NULL,
  `created_isodt` varchar(30) NOT NULL,
  `updated_isodt` varchar(30) DEFAULT NULL,
  `production_by` int(11) NOT NULL,
  `shift` enum('day_shift','night_shift') NOT NULL,
  `production_note` text DEFAULT NULL,
  `material_used_note` text DEFAULT NULL,
  `labour_cost` double NOT NULL,
  `material_cost` double NOT NULL,
  `others_cost` double NOT NULL,
  `total_cost` double NOT NULL,
  `status` enum('a','d','p') NOT NULL,
  `branch_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_productions_master`
--

INSERT INTO `tbl_product_productions_master` (`production_id`, `production_invoice`, `created_isodt`, `updated_isodt`, `production_by`, `shift`, `production_note`, `material_used_note`, `labour_cost`, `material_cost`, `others_cost`, `total_cost`, `status`, `branch_id`, `created_by`) VALUES
(1, 'PD-2021-1', '2021-02-20T15:56:31.375Z', NULL, 1, 'night_shift', NULL, NULL, 25000, 31600, 0, 56600, 'a', 1, 57),
(2, 'PD-2021-2', '2021-02-20T16:07:50.921Z', NULL, 1, 'day_shift', NULL, NULL, 200, 1432, 0, 1632, 'a', 1, 57),
(3, 'PD-2021-3', '2021-02-20T16:24:19.650Z', NULL, 1, 'day_shift', NULL, NULL, 3000, 39800, 0, 42800, 'a', 1, 57),
(4, 'PD-2021-4', '2021-02-20T17:28:02.168Z', NULL, 2, 'night_shift', NULL, NULL, 250, 1996, 50, 2296, 'a', 1, 57),
(5, 'PD-2021-5', '2021-02-20T17:32:41.717Z', NULL, 1, 'day_shift', NULL, NULL, 1000, 5482, 200, 6682, 'a', 1, 57),
(6, 'PD-2021-6', '2021-02-20T22:22:43.247Z', NULL, 1, 'day_shift', NULL, NULL, 3000, 17950, 0, 20950, 'a', 1, 57),
(7, 'PD-2021-7', '2021-03-26T10:57:06.932Z', NULL, 2, 'day_shift', NULL, NULL, 0, 800, 0, 800, 'a', 1, 57),
(8, 'PD-2021-8', '2021-03-27T05:27:21.653Z', NULL, 2, 'day_shift', NULL, NULL, 2000, 3543.3, 50, 5593.3, 'a', 1, 57),
(9, 'PD-2021-9', '2021-08-05T20:46:10.854Z', NULL, 1, 'day_shift', NULL, NULL, 0, 800, 0, 800, 'd', 1, 57);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_purchase_rate`
--

CREATE TABLE `tbl_product_purchase_rate` (
  `product_purchase_rate_id` int(11) NOT NULL,
  `prod_avarage_rate` text DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_purchase_rate`
--

INSERT INTO `tbl_product_purchase_rate` (`product_purchase_rate_id`, `prod_avarage_rate`, `product_id`, `branch_id`) VALUES
(1, '800', 2, 1),
(2, '500', 1, 1),
(3, '50', 8, 1),
(4, '100', 6, 1),
(5, '60', 7, 1),
(6, '80', 9, 1),
(7, '120', 10, 1),
(8, '2300', 3, 1),
(9, '9500', 5, 1),
(10, '15000', 4, 1),
(11, '90', 11, 1),
(12, '100', 12, 1),
(13, '1.11866', 14, 1),
(14, '44', 18, 1),
(15, '55', 22, 1),
(16, '200', 23, 1),
(17, '600', 24, 1),
(18, '300', 27, 1),
(19, '500', 26, 1),
(20, '600', 25, 1),
(21, '0', 28, 1),
(22, '0', 29, 1),
(23, '1000', 33, 1),
(24, '1000', 31, 1),
(25, '1000', 30, 1),
(26, '500', 32, 1),
(27, '1000', 33, 7),
(28, '1000', 30, 7),
(29, '12', 34, 1),
(30, '12', 35, 1),
(31, '8', 36, 1),
(32, '12', 37, 1),
(33, '10', 38, 1),
(34, '8', 39, 1),
(35, '12', 40, 1),
(36, '11.33', 41, 1),
(37, '8.44', 42, 1),
(38, '12', 43, 1),
(39, '10', 44, 1),
(40, '12', 45, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_sizes`
--

CREATE TABLE `tbl_product_sizes` (
  `prod_size_id` int(11) NOT NULL,
  `prod_size_name` varchar(255) NOT NULL,
  `prod_size_branch_id` int(11) NOT NULL,
  `prod_size_c_isodt` varchar(30) NOT NULL,
  `prod_size_u_isodt` varchar(30) NOT NULL,
  `prod_size_c_by` int(11) NOT NULL,
  `prod_size_u_by` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_transfer_details`
--

CREATE TABLE `tbl_product_transfer_details` (
  `transfer_d_id` int(11) NOT NULL,
  `transfer_id` int(11) NOT NULL,
  `transfer_prod_id` int(11) NOT NULL,
  `transfer_qty` double NOT NULL,
  `transfer_pur_rate` double NOT NULL,
  `transfer_total` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_transfer_details`
--

INSERT INTO `tbl_product_transfer_details` (`transfer_d_id`, `transfer_id`, `transfer_prod_id`, `transfer_qty`, `transfer_pur_rate`, `transfer_total`) VALUES
(1, 1, 8, 24, 49.8185401459854, 1195.68),
(2, 1, 1, 10, 456.9972159599212, 4570),
(3, 1, 2, 15, 572.8, 8592),
(4, 2, 1, 5, 456.9972159599212, 2285),
(5, 3, 6, 2, 99.81824561403508, 199.64),
(6, 4, 3, 2, 2300, 4600),
(7, 5, 1, 5, 456.9972159599212, 2285),
(8, 6, 2, 10, 574.0582524271844, 5740.599999999999),
(9, 7, 8, 3, 49.857678545870904, 149.57999999999998),
(10, 8, 8, 2, 49.857678545870904, 99.72);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_transfer_master`
--

CREATE TABLE `tbl_product_transfer_master` (
  `transfer_id` int(11) NOT NULL,
  `transfer_b_from` int(11) NOT NULL,
  `transfer_b_to` int(11) NOT NULL,
  `transfer_amount` double NOT NULL,
  `transfer_note` text DEFAULT NULL,
  `transfer_c_by` int(11) NOT NULL,
  `transfer_u_by` int(11) NOT NULL DEFAULT 0,
  `transfer_c_isodt` varchar(30) NOT NULL,
  `transfer_u_isodt` varchar(30) DEFAULT NULL,
  `transfer_status` enum('a','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_transfer_master`
--

INSERT INTO `tbl_product_transfer_master` (`transfer_id`, `transfer_b_from`, `transfer_b_to`, `transfer_amount`, `transfer_note`, `transfer_c_by`, `transfer_u_by`, `transfer_c_isodt`, `transfer_u_isodt`, `transfer_status`) VALUES
(1, 1, 6, 14357.68, '', 1, 0, '2021-02-20T19:20:35.752Z', NULL, 'a'),
(2, 1, 6, 2285, '', 2, 0, '2021-02-20T19:21:35.417Z', NULL, 'a'),
(3, 1, 7, 199.64, '', 2, 0, '2021-02-20T19:22:28.594Z', NULL, 'a'),
(4, 1, 6, 4600, '', 1, 0, '2021-02-20T19:22:48.575Z', NULL, 'a'),
(5, 1, 6, 2285, '', 1, 0, '2021-02-20T19:23:02.997Z', NULL, 'a'),
(6, 1, 6, 5740.599999999999, '', 2, 0, '2021-02-21T00:46:10.930Z', NULL, 'a'),
(7, 1, 7, 149.57999999999998, '', 2, 0, '2021-03-17T15:25:50.596Z', NULL, 'a'),
(8, 1, 7, 99.72, '', 2, 0, '2021-03-17T15:31:25.722Z', NULL, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product_units`
--

CREATE TABLE `tbl_product_units` (
  `prod_unit_id` int(11) NOT NULL,
  `prod_unit_name` varchar(255) NOT NULL,
  `prod_unit_created_isodt` varchar(30) NOT NULL,
  `prod_unit_updated_isodt` varchar(30) DEFAULT NULL,
  `prod_unit_created_by` int(11) NOT NULL DEFAULT 0,
  `prod_unit_updated_by` int(11) NOT NULL DEFAULT 0,
  `prod_unit_branch_id` int(11) NOT NULL,
  `prod_unit_status` enum('active','deactivated','pending') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_product_units`
--

INSERT INTO `tbl_product_units` (`prod_unit_id`, `prod_unit_name`, `prod_unit_created_isodt`, `prod_unit_updated_isodt`, `prod_unit_created_by`, `prod_unit_updated_by`, `prod_unit_branch_id`, `prod_unit_status`) VALUES
(1, 'KG', '2021-02-20T09:09:30.274Z', NULL, 57, 0, 1, 'deactivated'),
(2, 'Metter', '2021-02-20T09:10:21.052Z', NULL, 57, 0, 1, 'active'),
(3, 'Pcs', '2021-02-20T09:13:50.485Z', NULL, 57, 0, 1, 'active'),
(4, 'Ltr', '2021-02-20T12:27:17.247Z', NULL, 57, 0, 1, 'active'),
(5, 'bundle', '2021-06-23T06:00:28.654Z', NULL, 57, 0, 1, 'active'),
(6, 'Pcs', '2022-02-13T06:01:13.980Z', NULL, 57, 0, 8, 'active'),
(7, 'KG', '2022-02-13T06:01:54.874Z', NULL, 57, 0, 8, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchase_details`
--

CREATE TABLE `tbl_purchase_details` (
  `pur_d_id` int(11) NOT NULL,
  `pur_id` int(11) NOT NULL,
  `pur_prod_id` int(11) NOT NULL,
  `pur_qty` double NOT NULL,
  `pur_rate` double NOT NULL,
  `sale_rate` double NOT NULL,
  `pur_total_amount` double NOT NULL,
  `pur_discount_amount` double NOT NULL DEFAULT 0,
  `pur_discount_percent` double NOT NULL DEFAULT 0,
  `pur_status` enum('a','i','d') NOT NULL,
  `pur_d_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_purchase_details`
--

INSERT INTO `tbl_purchase_details` (`pur_d_id`, `pur_id`, `pur_prod_id`, `pur_qty`, `pur_rate`, `sale_rate`, `pur_total_amount`, `pur_discount_amount`, `pur_discount_percent`, `pur_status`, `pur_d_branch_id`) VALUES
(1, 1, 2, 40, 800, 1200, 32000, 0, 0, 'd', 1),
(2, 1, 1, 100, 500, 1000, 50000, 0, 0, 'd', 1),
(3, 2, 1, 30, 510, 1000, 15300, 0, 0, 'd', 1),
(4, 2, 2, 10, 780, 1200, 7800, 0, 0, 'd', 1),
(5, 3, 8, 200, 50, 60, 10000, 0, 0, 'd', 1),
(6, 3, 6, 300, 100, 109, 30000, 0, 0, 'd', 1),
(7, 3, 7, 150, 60, 70, 9000, 0, 0, 'd', 1),
(8, 4, 8, 20, 48, 60, 960, 0, 0, 'd', 1),
(9, 4, 6, 30, 98, 109, 2940, 0, 0, 'd', 1),
(10, 4, 7, 200, 58, 70, 11600, 0, 0, 'd', 1),
(11, 5, 8, 50, 49.82, 60, 2491, 0, 0, 'd', 1),
(12, 5, 6, 10, 99.82, 109, 998.1999999999999, 0, 0, 'd', 1),
(13, 5, 7, 20, 58.86, 70, 1177.2, 0, 0, 'd', 1),
(14, 6, 9, 200, 80, 90, 16000, 0, 0, 'd', 1),
(15, 6, 10, 100, 120, 135, 12000, 0, 0, 'd', 1),
(16, 7, 3, 25, 2300, 26000, 57500, 0, 0, 'd', 1),
(17, 7, 5, 20, 9500, 12000, 190000, 0, 0, 'd', 1),
(18, 8, 4, 10, 15000, 18000, 150000, 0, 0, 'd', 1),
(19, 9, 11, 100, 90, 100, 9000, 0, 0, 'd', 1),
(20, 9, 12, 200, 100, 110, 20000, 0, 0, 'd', 1),
(21, 10, 8, 4, 49.82, 60, 199.28, 0, 0, 'd', 1),
(22, 10, 6, 2, 99.82, 109, 199.64, 0, 0, 'd', 1),
(23, 10, 9, 6, 80, 90, 480, 0, 0, 'd', 1),
(24, 10, 12, 5, 100, 110, 500, 0, 0, 'd', 1),
(25, 10, 7, 4, 58.86, 70, 235.44, 0, 0, 'd', 1),
(26, 10, 3, 5, 2300, 26000, 11500, 0, 0, 'd', 1),
(27, 10, 2, 10, 796, 1200, 7960, 0, 0, 'd', 1),
(28, 10, 10, 66, 120, 135, 7920, 0, 0, 'd', 1),
(29, 10, 11, 60, 90, 100, 5400, 0, 0, 'd', 1),
(30, 10, 4, 5, 15000, 18000, 75000, 0, 0, 'd', 1),
(31, 10, 5, 4, 9500, 12000, 38000, 0, 0, 'd', 1),
(32, 10, 1, 8, 502.31, 1000, 4018.48, 0, 0, 'd', 1),
(33, 11, 8, 55, 50, 60, 2750, 0, 0, 'd', 1),
(34, 11, 2, 20, 580, 1200, 11600, 0, 0, 'd', 1),
(36, 12, 8, 5, 49.86, 60, 249.3, 0, 0, 'd', 1),
(38, 13, 8, 1, 70, 60, 70, 0, 0, 'd', 1),
(39, 14, 18, 3, 44, 0, 132, 0, 0, 'd', 1),
(44, 15, 22, 4, 55, 0, 220, 0, 0, 'd', 1),
(45, 16, 23, 50, 200, 0, 10000, 0, 0, 'd', 1),
(46, 17, 24, 100, 600, 550, 60000, 0, 0, 'd', 1),
(47, 17, 27, 100, 300, 0, 30000, 0, 0, 'd', 1),
(48, 17, 26, 100, 500, 0, 50000, 0, 0, 'd', 1),
(49, 17, 25, 100, 600, 0, 60000, 0, 0, 'd', 1),
(52, 18, 28, 100, 500, 0, 50000, 0, 0, 'd', 1),
(56, 19, 28, 5, 500, 0, 2500, 0, 0, 'd', 1),
(55, 19, 29, 100, 10, 0, 1000, 0, 0, 'd', 1),
(110, 20, 32, 10, 500, 0, 5000, 0, 0, 'd', 1),
(109, 20, 30, 10, 500, 0, 5000, 0, 0, 'd', 1),
(108, 20, 31, 10, 500, 0, 5000, 0, 0, 'd', 1),
(107, 20, 33, 10, 500, 0, 5000, 0, 0, 'd', 1),
(212, 21, 33, 10, 500, 0, 5000, 0, 0, 'd', 1),
(211, 21, 30, 10, 500, 0, 5000, 0, 0, 'd', 1),
(210, 21, 32, 10, 500, 0, 5000, 0, 0, 'd', 1),
(209, 21, 31, 10, 500, 0, 5000, 0, 0, 'd', 1),
(263, 23, 33, 10, 500, 0, 5000, 0, 0, 'd', 1),
(227, 22, 31, 10, 500, 0, 5000, 0, 0, 'd', 1),
(226, 22, 32, 10, 500, 0, 5000, 0, 0, 'd', 1),
(225, 22, 33, 10, 500, 0, 5000, 0, 0, 'd', 1),
(262, 23, 30, 10, 500, 0, 5000, 0, 0, 'd', 1),
(261, 23, 32, 10, 500, 0, 5000, 0, 0, 'd', 1),
(260, 23, 31, 10, 500, 0, 5000, 0, 0, 'd', 1),
(394, 24, 33, 10, 500, 0, 5000, 0, 0, 'd', 1),
(393, 24, 30, 10, 500, 0, 5000, 0, 0, 'd', 1),
(392, 24, 31, 10, 500, 0, 5000, 0, 0, 'd', 1),
(391, 24, 32, 10, 500, 0, 5000, 0, 0, 'd', 1),
(485, 25, 31, 20, 500, 0, 10000, 0, 0, 'd', 1),
(484, 25, 30, 20, 500, 0, 10000, 0, 0, 'd', 1),
(483, 25, 32, 20, 500, 0, 10000, 0, 0, 'd', 1),
(482, 25, 33, 20, 1000, 0, 20000, 0, 0, 'd', 1),
(566, 28, 34, 1, 10, 0, 10, 0, 0, 'd', 1),
(565, 27, 30, 10, 1000, 0, 10000, 0, 0, 'd', 1),
(564, 27, 33, 10, 1000, 0, 10000, 0, 0, 'd', 1),
(563, 26, 30, 20, 1000, 0, 20000, 0, 0, 'd', 1),
(568, 29, 34, 1, 12, 0, 12, 0, 0, 'd', 1),
(569, 30, 35, 1, 10, 0, 10, 0, 0, 'd', 1),
(574, 32, 36, 1, 10, 0, 10, 0, 0, 'd', 1),
(573, 33, 36, 1, 12, 0, 12, 0, 0, 'd', 1),
(575, 34, 37, 1, 10, 0, 10, 0, 0, 'd', 1),
(576, 35, 37, 1, 12, 0, 12, 0, 0, 'd', 1),
(577, 36, 37, 1, 10, 0, 10, 0, 0, 'd', 1),
(578, 37, 37, 1, 12, 0, 12, 0, 0, 'd', 1),
(583, 40, 39, 1, 10, 0, 10, 0, 0, 'd', 1),
(580, 39, 38, 1, 12, 0, 12, 0, 0, 'd', 1),
(591, 41, 39, 1, 12, 0, 12, 0, 0, 'd', 1),
(595, 44, 41, 1, 10, 0, 10, 0, 0, 'd', 1),
(593, 43, 40, 1, 12, 0, 12, 0, 0, 'd', 1),
(599, 45, 41, 1, 12, 0, 12, 0, 0, 'd', 1),
(600, 46, 42, 1, 10, 0, 10, 0, 0, 'd', 1),
(605, 47, 42, 1, 12, 0, 12, 0, 0, 'd', 1),
(612, 48, 27, 3, 300, 0, 900, 0, 0, 'd', 1),
(609, 49, 43, 1, 12, 0, 12, 0, 0, 'd', 1),
(613, 48, 43, 1, 10, 0, 10, 0, 0, 'd', 1),
(615, 50, 43, 1, 12, 0, 12, 0, 0, 'd', 1),
(616, 51, 44, 1, 10, 0, 10, 0, 0, 'd', 1),
(618, 52, 44, 1, 12, 0, 12, 0, 0, 'd', 1),
(625, 53, 44, 1, 12, 0, 12, 0, 0, 'd', 1),
(624, 54, 44, 1, 10, 0, 10, 0, 0, 'd', 1),
(626, 55, 45, 1, 10, 0, 10, 0, 0, 'd', 1),
(633, 56, 45, 1, 12, 0, 12, 0, 0, 'a', 1),
(635, 57, 45, 1, 10, 0, 10, 0, 0, 'a', 1),
(636, 58, 26, 4, 500, 0, 2000, 0, 0, 'a', 1),
(637, 59, 41, 33, 11.33, 0, 373.89, 0, 0, 'a', 1),
(638, 59, 42, 33, 8.44, 0, 278.52, 0, 0, 'a', 1),
(639, 59, 26, 33, 500, 0, 16500, 0, 0, 'a', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchase_master`
--

CREATE TABLE `tbl_purchase_master` (
  `pur_id` int(11) NOT NULL,
  `pur_supplier_id` int(11) NOT NULL,
  `pur_supplier_type` enum('general','reguler') NOT NULL,
  `pur_pay_method` enum('cash','bank') NOT NULL,
  `pur_bank_id` int(11) NOT NULL,
  `pur_emp_id` int(11) NOT NULL,
  `pur_invoice_no` varchar(50) NOT NULL,
  `pur_vat_amount` double NOT NULL,
  `pur_vat_percent` double NOT NULL,
  `pur_note` text NOT NULL,
  `pur_total_amount` double NOT NULL,
  `pur_discount_amount` double NOT NULL,
  `pur_discount_percent` double NOT NULL,
  `pur_subtotal_amount` double NOT NULL,
  `pur_paid_amount` double NOT NULL,
  `pur_due_amount` double NOT NULL,
  `pur_previous_due` double NOT NULL,
  `pur_transport_cost` double NOT NULL,
  `pur_created_isodt` varchar(30) NOT NULL,
  `pur_updated_isodt` varchar(30) DEFAULT NULL,
  `pur_created_by` int(11) NOT NULL,
  `pur_updated_by` int(11) DEFAULT NULL,
  `pur_branch_id` int(11) NOT NULL,
  `pur_status` enum('a','i','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_purchase_master`
--

INSERT INTO `tbl_purchase_master` (`pur_id`, `pur_supplier_id`, `pur_supplier_type`, `pur_pay_method`, `pur_bank_id`, `pur_emp_id`, `pur_invoice_no`, `pur_vat_amount`, `pur_vat_percent`, `pur_note`, `pur_total_amount`, `pur_discount_amount`, `pur_discount_percent`, `pur_subtotal_amount`, `pur_paid_amount`, `pur_due_amount`, `pur_previous_due`, `pur_transport_cost`, `pur_created_isodt`, `pur_updated_isodt`, `pur_created_by`, `pur_updated_by`, `pur_branch_id`, `pur_status`) VALUES
(1, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-1', 0, 0, '', 82000, 0, 0, 82000, 30000, 52000, 15000, 0, '2021-02-20T13:59:43.073Z', NULL, 57, NULL, 1, 'd'),
(2, 10, 'reguler', 'bank', 1, 0, 'PUR-2021-2', 0, 0, '', 23100, 0, 0, 23100, 10000, 13100, 67000, 0, '2021-02-20T14:01:25.743Z', NULL, 57, NULL, 1, 'd'),
(3, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-3', 0, 0, '', 49000, 0, 0, 49000, 20000, 29000, 80100, 0, '2021-02-20T14:03:25.503Z', NULL, 57, NULL, 1, 'd'),
(4, 10, 'reguler', 'bank', 2, 0, 'PUR-2021-4', 0, 0, '', 15500, 0, 0, 15500, 10000, 5500, 109100, 0, '2021-02-20T14:07:02.248Z', NULL, 57, NULL, 1, 'd'),
(5, 9, 'reguler', 'bank', 2, 0, 'PUR-2021-5', 0, 0, '', 4666.4, 0, 0, 4666.4, 4500, 166.39999999999964, 20000, 0, '2021-02-20T14:09:24.440Z', NULL, 57, NULL, 1, 'd'),
(6, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-6', 0, 0, '', 28000, 0, 0, 28000, 20000, 8000, 114600, 0, '2021-02-20T14:11:58.174Z', NULL, 57, NULL, 1, 'd'),
(7, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-7', 0, 0, '', 247500, 0, 0, 247500, 100000, 147500, 122600, 0, '2021-02-20T14:13:33.791Z', NULL, 57, NULL, 1, 'd'),
(8, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-8', 0, 0, '', 150000, 0, 0, 150000, 100000, 50000, 270100, 0, '2021-02-20T14:20:10.631Z', NULL, 57, NULL, 1, 'd'),
(9, 10, 'reguler', 'bank', 1, 0, 'PUR-2021-9', 0, 0, '', 29000, 0, 0, 29000, 2000, 27000, 320100, 0, '2021-02-20T14:21:15.104Z', NULL, 57, NULL, 1, 'd'),
(10, 9, 'reguler', 'cash', 0, 0, 'PUR-2021-10', 0, 0, '', 151412.84, 0, 0, 151412.84, 50000, 101412.84, 20166.4, 0, '2021-02-20T14:24:14.518Z', NULL, 57, NULL, 1, 'd'),
(11, 10, 'reguler', 'bank', 2, 0, 'PUR-2021-11', 0, 0, '', 14350, 0, 0, 14350, 5000, 9350, 499040, 0, '2021-02-20T21:07:58.652Z', NULL, 57, NULL, 1, 'd'),
(12, 10, 'reguler', 'cash', 0, 0, 'PUR-2021-12', 0, 0, '', 249.3, 0, 0, 249.3, 0, 249.3, 0, 0, '2021-03-21T18:00:32.269Z', NULL, 57, NULL, 1, 'd'),
(13, 115, 'reguler', 'cash', 0, 0, 'PUR-2021-13', 0, 0, '', 63, 7, 10, 70, 0, 63, 0, 0, '2021-05-21T07:51:40.405Z', NULL, 57, NULL, 1, 'd'),
(14, 122, 'general', 'cash', 0, 0, 'PUR-2021-14', 0, 0, '', 132, 0, 0, 132, 0, 132, 0, 0, '2021-06-20T18:57:21.593Z', NULL, 57, NULL, 1, 'd'),
(15, 142, 'general', 'cash', 0, 0, 'PUR-2021-15', 0, 0, '', 220, 0, 0, 220, 220, 0, 0, 0, '2021-06-23T06:17:56.865Z', NULL, 57, NULL, 1, 'd'),
(16, 144, 'general', 'cash', 0, 0, 'PUR-2021-16', 0, 0, '', 10000, 0, 0, 10000, 10000, 0, 0, 0, '2021-06-25T14:58:03.656Z', NULL, 57, NULL, 1, 'd'),
(17, 145, 'general', 'cash', 0, 0, 'PUR-2021-17', 0, 0, '', 200000, 0, 0, 200000, 200000, 0, 0, 0, '2021-06-26T06:53:03.747Z', NULL, 57, NULL, 1, 'd'),
(18, 148, 'general', 'cash', 0, 0, 'PUR-2021-18', 0, 0, '', 50000, 0, 0, 50000, 1000, 49000, 0, 0, '2021-08-05T15:46:31.457Z', NULL, 57, NULL, 1, 'd'),
(19, 150, 'general', 'cash', 0, 0, 'PUR-2021-19', 0, 0, '', 3500, 0, 0, 3500, 3500, 0, 0, 0, '2021-08-05T15:48:57.445Z', NULL, 57, NULL, 1, 'd'),
(20, 165, 'general', 'cash', 0, 0, 'PUR-2021-20', 0, 0, '', 20000, 0, 0, 20000, 5000, 15000, 0, 0, '2021-08-05T15:53:07.957Z', NULL, 57, NULL, 1, 'd'),
(21, 195, 'general', 'cash', 0, 0, 'PUR-2021-21', 0, 0, '', 20000, 0, 0, 20000, 20000, 0, 0, 0, '2021-08-05T17:06:11.059Z', NULL, 57, NULL, 1, 'd'),
(22, 199, 'general', 'cash', 0, 0, 'PUR-2021-22', 0, 0, '', 15000, 0, 0, 15000, 20000, -5000, 0, 0, '2021-08-05T17:54:55.546Z', NULL, 57, NULL, 1, 'd'),
(23, 208, 'general', 'cash', 0, 0, 'PUR-2021-23', 0, 0, '', 20000, 0, 0, 20000, 20000, 0, 0, 0, '2021-08-05T18:05:04.475Z', NULL, 57, NULL, 1, 'd'),
(24, 244, 'general', 'cash', 0, 0, 'PUR-2021-24', 0, 0, '', 20000, 0, 0, 20000, 20000, 0, 0, 0, '2021-08-05T18:25:00.274Z', NULL, 57, NULL, 1, 'd'),
(25, 277, 'general', 'cash', 0, 0, 'PUR-2021-25', 0, 0, '', 50000, 0, 0, 50000, 50000, 0, 0, 0, '2021-08-05T18:50:43.900Z', NULL, 57, NULL, 1, 'd'),
(26, 300, 'general', 'cash', 0, 0, 'PUR-2021-26', 0, 0, '', 20000, 0, 0, 20000, 40000, -20000, 0, 0, '2021-08-05T19:54:40.629Z', NULL, 57, NULL, 1, 'd'),
(27, 301, 'general', 'cash', 0, 0, 'PUR-2021-27', 0, 0, '', 20000, 0, 0, 20000, 20000, 0, 0, 0, '2021-08-05T20:39:53.732Z', NULL, 57, NULL, 1, 'd'),
(28, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-28', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T07:37:11.577Z', NULL, 57, NULL, 1, 'd'),
(29, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-29', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T07:37:24.779Z', NULL, 57, NULL, 1, 'd'),
(30, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-30', 0, 0, '', 10, 0, 0, 10, 0, 10, 22, 0, '2021-08-07T07:48:13.974Z', NULL, 57, NULL, 1, 'd'),
(31, 307, 'general', 'cash', 0, 0, 'PUR-2021-31', 0, 0, '', 12, 0, 0, 12, 12, 0, 0, 0, '2021-08-07T07:49:35.110Z', NULL, 57, NULL, 1, 'd'),
(32, 310, 'general', 'cash', 0, 0, 'PUR-2021-32', 0, 0, '', 10, 0, 0, 10, 10, 0, 0, 0, '2021-08-07T08:26:13.851Z', NULL, 57, NULL, 1, 'd'),
(33, 309, 'general', 'cash', 0, 0, 'PUR-2021-33', 0, 0, '', 12, 0, 0, 12, 12, 0, 0, 0, '2021-08-07T08:26:24.577Z', NULL, 57, NULL, 1, 'd'),
(34, 311, 'general', 'cash', 0, 0, 'PUR-2021-34', 0, 0, '', 10, 0, 0, 10, 10, 0, 0, 0, '2021-08-07T08:34:31.097Z', NULL, 57, NULL, 1, 'd'),
(35, 312, 'general', 'cash', 0, 0, 'PUR-2021-35', 0, 0, '', 12, 0, 0, 12, 12, 0, 0, 0, '2021-08-07T08:34:50.154Z', NULL, 57, NULL, 1, 'd'),
(36, 313, 'general', 'cash', 0, 0, 'PUR-2021-36', 0, 0, '', 10, 0, 0, 10, 10, 0, 0, 0, '2021-08-07T08:40:51.098Z', NULL, 57, NULL, 1, 'd'),
(37, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-37', 0, 0, '', 12, 0, 0, 12, 0, 12, 32, 0, '2021-08-07T08:41:04.346Z', NULL, 57, NULL, 1, 'd'),
(38, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-38', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T08:44:18.597Z', NULL, 57, NULL, 1, 'd'),
(39, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-39', 0, 0, '', 12, 0, 0, 12, 0, 12, 54, 0, '2021-08-07T08:44:30.378Z', NULL, 57, NULL, 1, 'd'),
(40, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-40', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T09:08:41.165Z', NULL, 57, NULL, 1, 'd'),
(41, 322, 'general', 'cash', 0, 0, 'PUR-2021-41', 0, 0, '', 12, 0, 0, 12, 12, 0, 0, 0, '2021-08-07T09:08:54.029Z', NULL, 57, NULL, 1, 'd'),
(42, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-42', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T09:37:41.008Z', NULL, 57, NULL, 1, 'd'),
(43, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-43', 0, 0, '', 12, 0, 0, 12, 0, 12, 108, 0, '2021-08-07T09:37:54.372Z', NULL, 57, NULL, 1, 'd'),
(44, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-44', 0, 0, '', 10, 0, 0, 10, 0, 10, 120, 0, '2021-08-07T10:49:26.918Z', NULL, 57, NULL, 1, 'd'),
(45, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-45', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T10:49:37.693Z', NULL, 57, NULL, 1, 'd'),
(46, 323, 'general', 'cash', 0, 0, 'PUR-2021-46', 0, 0, '', 10, 0, 0, 10, 10, 0, 0, 0, '2021-08-07T10:55:19.538Z', NULL, 57, NULL, 1, 'd'),
(47, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-47', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T10:55:28.938Z', NULL, 57, NULL, 1, 'd'),
(48, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-48', 0, 0, '', 910, 0, 0, 910, 0, 910, 0, 0, '2021-08-07T10:59:53.434Z', NULL, 57, NULL, 1, 'd'),
(49, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-49', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T11:00:03.065Z', NULL, 57, NULL, 1, 'd'),
(50, 325, 'general', 'cash', 0, 0, 'PUR-2021-50', 0, 0, '', 12, 0, 0, 12, 12, 0, 0, 0, '2021-08-07T11:08:00.721Z', NULL, 57, NULL, 1, 'd'),
(51, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-51', 0, 0, '', 10, 0, 0, 10, 0, 10, 1064, 0, '2021-08-07T11:29:47.226Z', NULL, 57, NULL, 1, 'd'),
(52, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-52', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T11:29:57.543Z', NULL, 57, NULL, 1, 'd'),
(53, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-53', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T11:49:23.485Z', NULL, 57, NULL, 1, 'd'),
(54, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-54', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T11:49:40.106Z', NULL, 57, NULL, 1, 'd'),
(55, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-55', 0, 0, '', 10, 0, 0, 10, 0, 10, 44, 0, '2021-08-07T12:30:51.575Z', NULL, 57, NULL, 1, 'd'),
(56, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-56', 0, 0, '', 12, 0, 0, 12, 0, 12, 0, 0, '2021-08-07T12:31:05.578Z', NULL, 57, NULL, 1, 'a'),
(57, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-57', 0, 0, '', 10, 0, 0, 10, 0, 10, 0, 0, '2021-08-07T14:52:12.851Z', NULL, 57, NULL, 1, 'a'),
(58, 136, 'reguler', 'cash', 0, 0, 'PUR-2021-58', 0, 0, '', 2000, 0, 0, 2000, 0, 2000, 22, 0, '2021-08-28T16:14:30.330Z', NULL, 57, NULL, 1, 'a'),
(59, 115, 'reguler', 'cash', 0, 0, 'PUR-2021-59', 0, 0, '', 17152.41, 0, 0, 17152.41, 0, 17152.41, 1505, 0, '2021-09-14T11:01:50.074Z', NULL, 57, NULL, 1, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchase_return`
--

CREATE TABLE `tbl_purchase_return` (
  `pur_return_id` int(11) NOT NULL,
  `pur_invoice_no` varchar(100) NOT NULL,
  `pur_return_amount` double NOT NULL,
  `pur_return_invoice` varchar(50) DEFAULT NULL,
  `pur_supplier_id` int(11) NOT NULL,
  `pur_return_note` text DEFAULT NULL,
  `pur_return_status` enum('a','i','d') NOT NULL,
  `pur_return_created_by` int(11) NOT NULL,
  `pur_return_updateded_by` int(11) NOT NULL DEFAULT 0,
  `pur_return_created_isodt` varchar(30) NOT NULL,
  `pur_return_updated_isodt` varchar(30) DEFAULT NULL,
  `pur_return_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_purchase_return`
--

INSERT INTO `tbl_purchase_return` (`pur_return_id`, `pur_invoice_no`, `pur_return_amount`, `pur_return_invoice`, `pur_supplier_id`, `pur_return_note`, `pur_return_status`, `pur_return_created_by`, `pur_return_updateded_by`, `pur_return_created_isodt`, `pur_return_updated_isodt`, `pur_return_branch_id`) VALUES
(1, 'PUR-2021-9', 2000, NULL, 10, NULL, 'a', 57, 0, '2021-02-20T14:21:15.104Z', NULL, 1),
(2, 'PUR-2021-7', 6900, NULL, 10, NULL, 'a', 57, 0, '2021-02-20T14:13:33.791Z', NULL, 1),
(3, 'PUR-2021-6', 360, NULL, 10, NULL, 'a', 57, 0, '2021-02-20T14:11:58.174Z', NULL, 1),
(4, 'PUR-2021-5', 294.3, NULL, 9, NULL, 'a', 57, 0, '2021-02-20T14:09:24.440Z', NULL, 1),
(5, 'PUR-2021-11', 1160, NULL, 10, NULL, 'a', 57, 0, '2021-02-20T21:08:58.652Z', NULL, 1),
(6, 'PUR-2021-57', 10, NULL, 136, NULL, 'a', 57, 0, '2021-08-07T14:52:12.851Z', NULL, 1),
(7, 'PUR-2021-56', 12, NULL, 136, NULL, 'a', 57, 0, '2021-08-07T12:31:05.578Z', NULL, 1),
(8, 'PUR-2021-58', 1000, NULL, 136, NULL, 'a', 57, 0, '2021-08-28T16:14:52.866Z', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchase_return_details`
--

CREATE TABLE `tbl_purchase_return_details` (
  `pur_return_d_id` int(11) NOT NULL,
  `pur_return_id` int(11) NOT NULL,
  `pur_return_prod_id` int(11) NOT NULL,
  `pur_return_qty` int(11) NOT NULL,
  `pur_return_rate` int(11) NOT NULL,
  `pur_return_amount` double NOT NULL,
  `pur_return_status` enum('a','i','d') NOT NULL,
  `pur_return_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_purchase_return_details`
--

INSERT INTO `tbl_purchase_return_details` (`pur_return_d_id`, `pur_return_id`, `pur_return_prod_id`, `pur_return_qty`, `pur_return_rate`, `pur_return_amount`, `pur_return_status`, `pur_return_branch_id`) VALUES
(1, 1, 11, 20, 90, 1800, 'a', 1),
(2, 1, 12, 2, 100, 200, 'a', 1),
(3, 2, 3, 3, 2300, 6900, 'a', 1),
(4, 3, 9, 3, 80, 240, 'a', 1),
(5, 3, 10, 1, 120, 120, 'a', 1),
(6, 4, 7, 5, 59, 294.3, 'a', 1),
(7, 5, 2, 2, 580, 1160, 'a', 1),
(8, 6, 45, 1, 10, 10, 'a', 1),
(9, 7, 45, 1, 12, 12, 'a', 1),
(10, 8, 26, 2, 500, 1000, 'a', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pur_ser_details`
--

CREATE TABLE `tbl_pur_ser_details` (
  `pur_ser_d_id` int(11) NOT NULL,
  `pur_ser_id` int(11) NOT NULL,
  `pur_ser_prod_id` int(11) NOT NULL,
  `pur_ser_qty` double NOT NULL,
  `pur_ser_rate` double NOT NULL,
  `pur_ser_total_amount` double NOT NULL,
  `pur_ser_discount_amount` double NOT NULL DEFAULT 0,
  `pur_ser_discount_percent` double NOT NULL DEFAULT 0,
  `pur_ser_status` enum('a','i','d') NOT NULL,
  `pur_ser_d_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pur_ser_master`
--

CREATE TABLE `tbl_pur_ser_master` (
  `pur_ser_id` int(11) NOT NULL,
  `pur_ser_supplier_id` int(11) NOT NULL,
  `pur_ser_supplier_type` enum('general','reguler') NOT NULL,
  `pur_ser_pay_method` enum('cash','bank') NOT NULL,
  `pur_ser_bank_id` int(11) NOT NULL,
  `pur_ser_emp_id` int(11) NOT NULL,
  `pur_ser_invoice_no` varchar(50) NOT NULL,
  `pur_ser_vat_amount` double NOT NULL,
  `pur_ser_vat_percent` double NOT NULL,
  `pur_ser_note` text NOT NULL,
  `pur_ser_total_amount` double NOT NULL,
  `pur_ser_discount_amount` double NOT NULL,
  `pur_ser_discount_percent` double NOT NULL,
  `pur_ser_subtotal_amount` double NOT NULL,
  `pur_ser_paid_amount` double NOT NULL,
  `pur_ser_due_amount` double NOT NULL,
  `pur_ser_previous_due` double NOT NULL,
  `pur_ser_transport_cost` double NOT NULL,
  `pur_ser_created_isodt` varchar(30) NOT NULL,
  `pur_ser_updated_isodt` varchar(30) DEFAULT NULL,
  `pur_ser_created_by` int(11) NOT NULL,
  `pur_ser_updated_by` int(11) DEFAULT NULL,
  `pur_ser_branch_id` int(11) NOT NULL,
  `pur_ser_status` enum('a','i','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_quotation_details`
--

CREATE TABLE `tbl_quotation_details` (
  `sale_d_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `sale_prod_id` int(11) NOT NULL,
  `sale_d_branch_id` int(11) NOT NULL,
  `sale_qty` double NOT NULL,
  `sale_prod_purchase_rate` double NOT NULL,
  `sale_rate` double NOT NULL,
  `sale_prod_total` double NOT NULL,
  `sale_prod_discount` double NOT NULL DEFAULT 0,
  `sale_d_status` enum('a','i','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_quotation_details`
--

INSERT INTO `tbl_quotation_details` (`sale_d_id`, `sale_id`, `sale_prod_id`, `sale_d_branch_id`, `sale_qty`, `sale_prod_purchase_rate`, `sale_rate`, `sale_prod_total`, `sale_prod_discount`, `sale_d_status`) VALUES
(1, 1, 8, 1, 5, 49.8185401459854, 60, 300, 0, 'a'),
(2, 1, 12, 1, 7, 100, 110, 770, 0, 'a'),
(3, 2, 3, 1, 5, 2300, 26000, 130000, 0, 'a'),
(4, 3, 6, 1, 6, 99.81824561403508, 109, 654, 0, 'a'),
(5, 3, 2, 1, 7, 796, 1200, 8400, 0, 'a'),
(6, 4, 1, 1, 55, 502.3078260869565, 1000, 55000, 0, 'a'),
(7, 4, 12, 1, 7, 100, 110, 770, 0, 'a'),
(8, 5, 12, 1, 66, 100, 110, 7260, 0, 'a'),
(9, 5, 11, 1, 33, 90, 100, 3300, 0, 'a'),
(10, 6, 7, 1, 5, 58.85732620320856, 70, 350, 0, 'a'),
(11, 6, 9, 1, 44, 80, 90, 3960, 0, 'a'),
(12, 7, 3, 1, 55, 2300, 26000, 1430000, 0, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_quotation_master`
--

CREATE TABLE `tbl_quotation_master` (
  `sale_id` int(11) NOT NULL,
  `sale_invoice` varchar(50) NOT NULL,
  `sale_cus_type` enum('general','retail','wholesale') NOT NULL,
  `sale_pay_method` enum('cash','bank') NOT NULL DEFAULT 'cash',
  `sale_bank_id` int(11) NOT NULL,
  `sale_customer_id` int(11) NOT NULL,
  `sale_emp_id` int(11) NOT NULL,
  `sale_note` text DEFAULT NULL,
  `sale_total_amount` double NOT NULL,
  `sale_discount_amount` double NOT NULL,
  `sale_transport_cost` double NOT NULL,
  `sale_vat_amount` double NOT NULL,
  `sale_subtotal_amount` double NOT NULL,
  `sale_paid_amount` double NOT NULL,
  `sale_due_amount` double NOT NULL,
  `sale_previous_due` double NOT NULL,
  `sale_branch_id` int(11) NOT NULL,
  `sale_created_isodt` varchar(30) NOT NULL,
  `sale_updated_isodt` varchar(30) DEFAULT NULL,
  `sale_created_by` int(11) NOT NULL,
  `sale_status` enum('a','i','d') NOT NULL,
  `sale_updated_by` int(11) NOT NULL DEFAULT 0,
  `sale_vat_percent` double NOT NULL,
  `sale_discount_percent` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_quotation_master`
--

INSERT INTO `tbl_quotation_master` (`sale_id`, `sale_invoice`, `sale_cus_type`, `sale_pay_method`, `sale_bank_id`, `sale_customer_id`, `sale_emp_id`, `sale_note`, `sale_total_amount`, `sale_discount_amount`, `sale_transport_cost`, `sale_vat_amount`, `sale_subtotal_amount`, `sale_paid_amount`, `sale_due_amount`, `sale_previous_due`, `sale_branch_id`, `sale_created_isodt`, `sale_updated_isodt`, `sale_created_by`, `sale_status`, `sale_updated_by`, `sale_vat_percent`, `sale_discount_percent`) VALUES
(1, 'Q-2021-1', 'wholesale', 'cash', 0, 2, 0, NULL, 1070, 0, 0, 0, 1070, 0, 1070, 0, 1, '2021-02-20T15:09:51.139Z', NULL, 57, 'a', 0, 0, 0),
(2, 'Q-2021-2', 'wholesale', 'cash', 0, 1, 0, NULL, 130000, 0, 0, 0, 130000, 0, 130000, 0, 1, '2021-02-20T15:10:15.552Z', NULL, 57, 'a', 0, 0, 0),
(3, 'Q-2021-3', 'retail', 'cash', 0, 6, 0, NULL, 9054, 0, 0, 0, 9054, 0, 9054, 0, 1, '2021-02-20T15:10:31.264Z', NULL, 57, 'a', 0, 0, 0),
(4, 'Q-2021-4', 'retail', 'cash', 0, 7, 0, NULL, 55770, 0, 0, 0, 55770, 0, 55770, 0, 1, '2021-02-20T15:10:48.569Z', NULL, 57, 'a', 0, 0, 0),
(5, 'Q-2021-5', 'retail', 'cash', 0, 8, 0, NULL, 10560, 0, 0, 0, 10560, 0, 10560, 0, 1, '2021-02-20T15:11:16.224Z', NULL, 57, 'a', 0, 0, 0),
(6, 'Q-2021-6', 'wholesale', 'cash', 0, 2, 0, NULL, 4310, 0, 0, 0, 4310, 0, 4310, 0, 1, '2021-02-20T15:11:29.027Z', NULL, 57, 'a', 0, 0, 0),
(7, 'Q-2021-7', 'retail', 'cash', 0, 10, 0, NULL, 1430000, 0, 0, 0, 1430000, 0, 1430000, 0, 1, '2021-02-20T15:11:43.672Z', NULL, 57, 'a', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sales_details`
--

CREATE TABLE `tbl_sales_details` (
  `sale_d_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `sale_prod_id` int(11) NOT NULL,
  `sale_date_time` varchar(30) NOT NULL,
  `sale_d_branch_id` int(11) NOT NULL,
  `sale_qty` double NOT NULL,
  `sale_prod_purchase_rate` text DEFAULT NULL,
  `sale_rate` double NOT NULL,
  `sale_prod_total` double NOT NULL,
  `sale_prod_discount` double NOT NULL DEFAULT 0,
  `sale_d_status` enum('a','i','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_sales_details`
--

INSERT INTO `tbl_sales_details` (`sale_d_id`, `sale_id`, `sale_prod_id`, `sale_date_time`, `sale_d_branch_id`, `sale_qty`, `sale_prod_purchase_rate`, `sale_rate`, `sale_prod_total`, `sale_prod_discount`, `sale_d_status`) VALUES
(1, 1, 8, '2021-02-20T14:32:11.683Z', 1, 20, '49.8185401459854', 60, 1200, 0, 'a'),
(2, 1, 6, '2021-02-20T14:32:11.683Z', 1, 42, '99.81824561403508', 109, 4578, 0, 'a'),
(3, 1, 9, '2021-02-20T14:32:11.683Z', 1, 10, '80', 90, 900, 0, 'a'),
(10, 2, 4, '2021-02-20T14:34:22.046Z', 1, 3, '15000', 18000, 54000, 0, 'a'),
(9, 2, 5, '2021-02-20T14:34:22.046Z', 1, 1, '9500', 12000, 12000, 0, 'a'),
(8, 2, 1, '2021-02-20T14:34:22.046Z', 1, 20, '502.3078260869565', 1000, 20000, 0, 'a'),
(11, 2, 11, '2021-02-20T14:34:22.046Z', 1, 5, '90', 100, 500, 0, 'a'),
(12, 3, 12, '2021-02-20T14:35:51.448Z', 1, 3, '100', 110, 330, 0, 'a'),
(13, 4, 8, '2021-02-20T14:42:54.153Z', 1, 30, '49.8185401459854', 61, 1830, 0, 'a'),
(14, 4, 2, '2021-02-20T14:42:54.153Z', 1, 50, '796', 1200, 60000, 0, 'a'),
(15, 5, 7, '2021-02-20T14:51:06.678Z', 1, 74, '58.85732620320856', 70, 5180, 0, 'a'),
(16, 6, 2, '2021-02-20T17:47:55.397Z', 1, 10, '572.8', 1200, 12000, 0, 'a'),
(17, 6, 1, '2021-02-20T17:47:55.397Z', 1, 43, '456.9972159599212', 1000, 43000, 0, 'a'),
(21, 7, 2, '2021-02-20T23:49:01.924Z', 1, 3, '574.0582524271844', 1200, 3600, 0, 'a'),
(20, 7, 8, '2021-02-20T23:49:01.924Z', 1, 55, '49.857678545870904', 60, 3300, 0, 'a'),
(22, 8, 8, '2021-03-26T06:35:00.905Z', 1, 4, '49.85773658222413', 60, 240, 0, 'a'),
(23, 9, 8, '2021-03-26T08:58:17.761Z', 1, 5, '49.85773658222413', 60, 300, 0, 'a'),
(24, 10, 14, '2021-03-27T05:53:30.904Z', 1, 2000, '1.11866', 6.22, 12440, 0, 'a'),
(25, 11, 14, '2021-03-27T06:52:22.353Z', 1, 50, '1.11866', 5, 250, 0, 'a'),
(26, 12, 8, '2021-03-28T10:00:34.499Z', 1, 5, '49.85779432247351', 60, 300, 0, 'a'),
(27, 13, 8, '2021-05-11T00:54:54.710Z', 1, 3, '49.85779432247351', 60, 180, 0, 'a'),
(28, 14, 8, '2021-05-21T07:46:17.826Z', 1, 1, '49.85779432247351', 60, 60, 0, 'a'),
(29, 15, 8, '2021-05-21T08:05:18.470Z', 1, 1, '49.96493371437525', 60, 60, 0, 'a'),
(30, 16, 6, '2021-05-21T09:47:59.388Z', 1, 10, '99.81824561403508', 109, 1090, 0, 'a'),
(31, 17, 2, '2021-05-21T09:49:39.985Z', 1, 3, '574.0582524271844', 1200, 3600, 0, 'a'),
(32, 18, 8, '2021-06-17T13:21:19.505Z', 1, 3, '49.96493371437525', 60, 180, 0, 'a'),
(33, 18, 6, '2021-06-17T13:21:19.505Z', 1, 4, '99.81824561403508', 109, 436, 0, 'a'),
(34, 19, 14, '2021-06-17T13:21:32.088Z', 1, 2, '1.11866', 44, 88, 0, 'a'),
(35, 20, 6, '2021-06-17T13:28:17.740Z', 1, 3, '99.81824561403508', 109, 327, 0, 'a'),
(36, 21, 18, '2021-06-20T18:57:34.983Z', 1, 1, '44', 22, 22, 0, 'a'),
(37, 23, 22, '2021-06-25T14:44:17.107Z', 1, 2, '55', 33, 66, 0, 'a'),
(38, 24, 23, '2021-06-25T14:58:20.464Z', 1, 5, '200', 250, 1250, 0, 'a'),
(40, 25, 23, '2021-06-25T14:59:00.516Z', 1, 5, '200', 255, 1275, 0, 'a'),
(41, 26, 23, '2020-06-01T17:52:00.000Z', 1, 2, '200', 300, 600, 0, 'a'),
(42, 27, 24, '2021-06-26T06:54:38.024Z', 1, 10, '600', 550, 5500, 0, 'a'),
(43, 27, 27, '2021-06-26T06:54:38.024Z', 1, 10, '300', 350, 3500, 0, 'a'),
(44, 27, 26, '2021-06-26T06:54:38.024Z', 1, 20, '500', 550, 11000, 0, 'a'),
(45, 27, 25, '2021-06-26T06:54:38.024Z', 1, 10, '600', 700, 7000, 0, 'a'),
(46, 28, 26, '2021-06-26T06:55:56.379Z', 1, 5, '500', 550, 2750, 0, 'a'),
(47, 28, 27, '2021-06-26T06:55:56.379Z', 1, 10, '300', 350, 3500, 0, 'a'),
(48, 28, 25, '2021-06-26T06:55:56.379Z', 1, 15, '600', 750, 11250, 0, 'a'),
(49, 28, 24, '2021-06-26T06:55:56.379Z', 1, 20, '600', 500, 10000, 0, 'a'),
(50, 29, 26, '2021-07-10T08:49:35.656Z', 1, 3, '500', 44, 132, 0, 'a'),
(51, 30, 26, '2021-07-12T09:51:03.097Z', 1, 1, '500', 550, 550, 0, 'a'),
(52, 31, 26, '2021-09-14T11:13:17.510Z', 1, 1, '500', 33, 33, 0, 'a'),
(53, 31, 42, '2021-09-14T11:13:17.510Z', 1, 13, '8.44', 44, 572, 0, 'a'),
(54, 32, 26, '2021-10-06T05:52:59.269Z', 1, 1, '500', 100, 100, 0, 'a'),
(55, 32, 26, '2021-10-06T05:52:59.269Z', 1, 5, '500', 300, 1500, 0, 'a'),
(56, 32, 26, '2021-10-06T05:52:59.269Z', 1, 5, '500', 0, 0, 0, 'a'),
(57, 33, 26, '2022-05-10T13:42:04.569Z', 1, 1, '500', 11, 11, 0, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sales_master`
--

CREATE TABLE `tbl_sales_master` (
  `sale_id` int(11) NOT NULL,
  `sale_invoice` varchar(50) NOT NULL,
  `sale_cus_type` enum('general','retail','wholesale') NOT NULL,
  `sale_pay_method` enum('cash','bank') NOT NULL DEFAULT 'cash',
  `sale_bank_id` int(11) NOT NULL,
  `sale_customer_id` int(11) NOT NULL,
  `sale_emp_id` int(11) NOT NULL,
  `sale_note` text DEFAULT NULL,
  `sale_total_amount` double NOT NULL,
  `sale_discount_amount` double NOT NULL,
  `sale_transport_cost` double NOT NULL,
  `sale_vat_amount` double NOT NULL,
  `sale_subtotal_amount` double NOT NULL,
  `sale_paid_amount` double NOT NULL,
  `sale_due_amount` double NOT NULL,
  `sale_previous_due` double NOT NULL,
  `sale_branch_id` int(11) NOT NULL,
  `sale_created_isodt` varchar(30) NOT NULL,
  `sale_updated_isodt` varchar(30) DEFAULT NULL,
  `sale_created_by` int(11) NOT NULL,
  `sale_status` enum('a','i','d') NOT NULL,
  `sale_updated_by` int(11) NOT NULL DEFAULT 0,
  `sale_vat_percent` double NOT NULL,
  `sale_discount_percent` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_sales_master`
--

INSERT INTO `tbl_sales_master` (`sale_id`, `sale_invoice`, `sale_cus_type`, `sale_pay_method`, `sale_bank_id`, `sale_customer_id`, `sale_emp_id`, `sale_note`, `sale_total_amount`, `sale_discount_amount`, `sale_transport_cost`, `sale_vat_amount`, `sale_subtotal_amount`, `sale_paid_amount`, `sale_due_amount`, `sale_previous_due`, `sale_branch_id`, `sale_created_isodt`, `sale_updated_isodt`, `sale_created_by`, `sale_status`, `sale_updated_by`, `sale_vat_percent`, `sale_discount_percent`) VALUES
(1, 'S-2021-1', 'retail', 'bank', 2, 5, 0, NULL, 6678, 0, 0, 0, 6678, 2000, 4678, 1000, 1, '2021-02-20T14:32:11.683Z', NULL, 57, 'a', 0, 0, 0),
(2, 'S-2021-2', 'general', 'cash', 0, 5, 2, NULL, 86500, 0, 0, 0, 86500, 20000, 66500, 71780, 1, '2021-02-20T14:34:22.046Z', NULL, 57, 'a', 0, 0, 0),
(3, 'S-2021-3', 'retail', 'bank', 3, 5, 0, NULL, 330, 0, 0, 0, 330, 200, 130, 71780, 1, '2021-02-20T14:35:51.448Z', NULL, 57, 'a', 0, 0, 0),
(4, 'S-2021-4', 'retail', 'cash', 0, 5, 0, NULL, 61830, 0, 0, 0, 61830, 5000, 56830, 61910, 1, '2021-02-20T14:42:54.153Z', NULL, 57, 'a', 0, 0, 0),
(5, 'S-2021-5', 'retail', 'bank', 1, 5, 0, NULL, 5180, 0, 0, 0, 5180, 4000, 1180, 89920, 1, '2021-02-20T14:51:06.678Z', NULL, 57, 'a', 0, 0, 0),
(6, 'S-2021-6', 'retail', 'bank', 2, 5, 0, NULL, 55000, 0, 0, 0, 55000, 22000, 33000, 86100, 1, '2021-02-20T17:47:55.397Z', NULL, 57, 'a', 0, 0, 0),
(7, 'S-2021-7', 'general', 'bank', 2, 5, 0, NULL, 6900, 0, 0, 0, 6900, 6000, 900, 110000, 1, '2021-02-20T23:49:01.924Z', NULL, 57, 'a', 0, 0, 0),
(8, 'S-2021-8', 'retail', 'bank', 1, 5, 0, NULL, 240, 0, 0, 0, 240, 55, 185, 110000, 1, '2021-03-26T06:35:00.905Z', NULL, 57, 'a', 0, 0, 0),
(9, 'S-2021-9', 'retail', 'cash', 0, 5, 0, NULL, 300, 0, 0, 0, 300, 0, 300, 110185, 1, '2021-03-26T08:58:17.761Z', NULL, 57, 'a', 0, 0, 0),
(10, 'S-2021-10', 'wholesale', 'cash', 0, 12, 0, NULL, 12440, 0, 0, 0, 12440, 12000, 440, 0, 1, '2021-03-27T05:53:30.904Z', NULL, 57, 'a', 0, 0, 0),
(11, 'S-2021-11', 'retail', 'cash', 0, 5, 3, NULL, 250, 0, 0, 0, 250, 0, 250, 110485, 1, '2021-03-27T06:52:22.353Z', NULL, 57, 'a', 0, 0, 0),
(12, 'S-2021-12', 'retail', 'cash', 0, 5, 0, NULL, 300, 0, 0, 0, 300, 0, 300, 109535, 1, '2021-03-28T10:00:34.499Z', NULL, 57, 'a', 0, 0, 0),
(13, 'S-2021-13', 'retail', 'cash', 0, 5, 0, '', 180, 0, 0, 0, 180, 0, 180, 109835, 1, '2021-05-11T00:54:54.710Z', NULL, 57, 'a', 0, 0, 0),
(14, 'S-2021-14', 'retail', 'cash', 0, 5, 0, '', 60, 0, 0, 0, 60, 0, 60, 110015, 1, '2021-05-21T07:46:17.826Z', NULL, 57, 'a', 0, 0, 0),
(15, 'S-2021-15', 'retail', 'cash', 0, 5, 0, '', 60, 0, 0, 0, 60, 10, 50, 110075, 1, '2021-05-21T08:05:18.470Z', NULL, 57, 'a', 0, 0, 0),
(16, 'S-2021-16', 'retail', 'cash', 0, 5, 0, '', 1090, 0, 0, 0, 1090, 0, 1090, 110125, 1, '2021-05-21T09:47:59.388Z', NULL, 57, 'a', 0, 0, 0),
(17, 'S-2021-17', 'retail', 'cash', 0, 5, 0, '', 3600, 0, 0, 0, 3600, 0, 3600, 111215, 1, '2021-05-21T09:49:39.985Z', NULL, 57, 'a', 0, 0, 0),
(18, 'S-2021-18', 'general', 'cash', 0, 13, 0, '', 616, 0, 0, 0, 616, 616, 0, 0, 1, '2021-06-17T13:21:19.505Z', NULL, 57, 'a', 0, 0, 0),
(19, 'S-2021-19', 'general', 'cash', 0, 14, 0, '', 88, 0, 0, 0, 88, 88, 0, 0, 1, '2021-06-17T13:21:32.088Z', NULL, 57, 'a', 0, 0, 0),
(20, 'S-2021-20', 'general', 'cash', 0, 15, 0, '', 327, 0, 0, 0, 327, 327, 0, 0, 1, '2021-06-17T13:28:17.740Z', NULL, 57, 'a', 0, 0, 0),
(21, 'S-2021-21', 'retail', 'cash', 0, 5, 0, '', 22, 0, 0, 0, 22, 0, 22, 116209, 1, '2021-06-20T18:57:34.983Z', NULL, 57, 'a', 0, 0, 0),
(22, 'S-2021-22', 'retail', 'cash', 0, 5, 0, '', 10, 0, 0, 0, 10, 0, 10, 114837, 1, '2021-06-25T14:43:53.737Z', NULL, 57, 'a', 0, 0, 0),
(23, 'S-2021-23', 'retail', 'cash', 0, 5, 0, '', 66, 0, 0, 0, 66, 0, 66, 114847, 1, '2021-06-25T14:44:17.107Z', NULL, 57, 'a', 0, 0, 0),
(24, 'S-2021-24', 'retail', 'cash', 0, 5, 0, '', 1250, 0, 0, 0, 1250, 0, 1250, 114913, 1, '2021-06-25T14:58:20.464Z', NULL, 57, 'a', 0, 0, 0),
(25, 'S-2021-25', 'general', 'cash', 0, 5, 0, '', 1275, 0, 0, 0, 1275, 0, 1275, 117413, 1, '2021-06-25T14:59:00.516Z', NULL, 57, 'a', 0, 0, 0),
(26, 'S-2021-26', 'retail', 'cash', 0, 5, 0, '', 600, 0, 0, 0, 600, 0, 600, 117438, 1, '2020-06-01T17:52:00.000Z', NULL, 57, 'a', 0, 0, 0),
(27, 'S-2021-27', 'general', 'cash', 0, 17, 0, '', 27000, 0, 0, 0, 27000, 27000, 0, 0, 1, '2021-06-26T06:54:38.024Z', NULL, 57, 'a', 0, 0, 0),
(28, 'S-2021-28', 'general', 'cash', 0, 18, 0, '', 27500, 0, 0, 0, 27500, 27500, 0, 0, 1, '2021-06-26T06:55:56.379Z', NULL, 57, 'a', 0, 0, 0),
(29, 'S-2021-29', 'retail', 'cash', 0, 5, 0, '', 132, 0, 0, 0, 132, 0, 132, 118038, 1, '2021-07-10T08:49:35.656Z', NULL, 57, 'a', 0, 0, 0),
(30, 'S-2021-30', 'retail', 'cash', 0, 5, 0, '', 550, 0, 0, 0, 550, 0, 550, 118170, 1, '2021-07-12T09:51:03.097Z', NULL, 57, 'a', 0, 0, 0),
(31, 'S-2021-31', 'retail', 'cash', 0, 3758, 0, '', 605, 0, 0, 0, 605, 0, 605, 0, 1, '2021-09-14T11:13:17.510Z', NULL, 57, 'a', 0, 0, 0),
(32, 'S-2021-32', 'retail', 'cash', 0, 3758, 0, '', 1600, 0, 0, 0, 1600, 0, 1600, 605, 1, '2021-10-06T05:52:59.269Z', NULL, 57, 'a', 0, 0, 0),
(33, 'S-2022-33', 'retail', 'cash', 0, 3758, 0, '', 11, 0, 0, 0, 11, 0, 11, 2205, 1, '2022-05-10T13:42:04.569Z', NULL, 57, 'a', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sales_return`
--

CREATE TABLE `tbl_sales_return` (
  `sale_return_id` int(11) NOT NULL,
  `sale_invoice` varchar(100) DEFAULT NULL,
  `sale_return_amount` double NOT NULL,
  `sale_cus_id` int(11) NOT NULL,
  `sale_return_note` text DEFAULT NULL,
  `sale_return_status` enum('a','i','d') NOT NULL,
  `sale_return_created_by` int(11) NOT NULL,
  `sale_return_updated_by` int(11) DEFAULT 0,
  `sale_return_created_isodt` varchar(30) NOT NULL,
  `sale_return_updated_isodt` varchar(30) DEFAULT NULL,
  `sale_return_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_sales_return`
--

INSERT INTO `tbl_sales_return` (`sale_return_id`, `sale_invoice`, `sale_return_amount`, `sale_cus_id`, `sale_return_note`, `sale_return_status`, `sale_return_created_by`, `sale_return_updated_by`, `sale_return_created_isodt`, `sale_return_updated_isodt`, `sale_return_branch_id`) VALUES
(1, 'S-2021-1', 398, 5, NULL, 'a', 57, 0, '2021-02-20T14:34:03.665Z', NULL, 1),
(2, 'S-2021-3', 220, 5, NULL, 'a', 57, 0, '2021-02-20T14:49:31.031Z', NULL, 1),
(3, 'S-2021-4', 3600, 5, NULL, 'a', 57, 0, '2021-02-20T14:49:31.031Z', NULL, 1),
(4, 'S-2021-6', 3000, 5, NULL, 'a', 57, 0, '2021-02-21T00:02:33.955Z', NULL, 1),
(5, 'S-2021-7', 1200, 5, NULL, 'a', 57, 0, '2021-03-27T12:39:08.317Z', NULL, 1),
(6, 'S-2021-28', 750, 18, NULL, 'a', 57, 0, '2021-06-26T07:04:39.520Z', NULL, 1),
(7, 'S-2021-28', 1000, 18, NULL, 'a', 57, 0, '2021-10-26T07:26:07.244Z', NULL, 1),
(8, 'S-2021-28', 1000, 18, NULL, 'a', 57, 0, '2021-10-26T07:30:46.486Z', NULL, 1),
(9, 'S-2021-28', 1300, 18, NULL, 'a', 57, 0, '2021-10-26T07:31:20.459Z', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sales_return_details`
--

CREATE TABLE `tbl_sales_return_details` (
  `sale_return_d_id` int(11) NOT NULL,
  `sale_return_id` int(11) NOT NULL,
  `return_prod_id` int(11) NOT NULL,
  `return_qty` int(11) NOT NULL,
  `return_prod_rate` double NOT NULL,
  `return_amount` double NOT NULL,
  `return_status` enum('a','i','d') NOT NULL,
  `return_branch_id` int(11) NOT NULL,
  `costing` double NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_sales_return_details`
--

INSERT INTO `tbl_sales_return_details` (`sale_return_d_id`, `sale_return_id`, `return_prod_id`, `return_qty`, `return_prod_rate`, `return_amount`, `return_status`, `return_branch_id`, `costing`) VALUES
(1, 1, 6, 2, 109, 218, 'a', 1, 0),
(2, 1, 9, 2, 90, 180, 'a', 1, 0),
(3, 2, 12, 2, 110, 220, 'a', 1, 0),
(4, 3, 2, 3, 1200, 3600, 'a', 1, 0),
(5, 4, 1, 3, 1000, 3000, 'a', 1, 0),
(6, 5, 2, 1, 1200, 1200, 'a', 1, 0),
(7, 6, 25, 1, 750, 750, 'a', 1, 0),
(8, 7, 24, 2, 500, 1000, 'a', 1, 0),
(9, 8, 24, 2, 500, 1000, 'a', 1, 0),
(10, 9, 25, 1, 750, 750, 'a', 1, 0),
(11, 9, 26, 1, 550, 550, 'a', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_service_details`
--

CREATE TABLE `tbl_service_details` (
  `service_d_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `service_prod_id` int(11) NOT NULL,
  `service_d_branch_id` int(11) NOT NULL,
  `service_qty` double NOT NULL,
  `service_rate` double NOT NULL,
  `service_prod_total` double NOT NULL,
  `service_prod_discount` double NOT NULL DEFAULT 0,
  `service_d_status` enum('a','i','d') NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_service_master`
--

CREATE TABLE `tbl_service_master` (
  `service_id` int(11) NOT NULL,
  `service_invoice` varchar(50) NOT NULL,
  `service_cus_type` enum('general','retail','wholesale') NOT NULL,
  `service_pay_method` enum('cash','bank') NOT NULL DEFAULT 'cash',
  `service_bank_id` int(11) NOT NULL,
  `service_customer_id` int(11) NOT NULL,
  `service_emp_id` int(11) NOT NULL,
  `service_note` text DEFAULT NULL,
  `service_total_amount` double NOT NULL,
  `service_discount_amount` double NOT NULL,
  `service_transport_cost` double NOT NULL,
  `service_vat_amount` double NOT NULL,
  `service_subtotal_amount` double NOT NULL,
  `service_paid_amount` double NOT NULL,
  `service_due_amount` double NOT NULL,
  `service_previous_due` double NOT NULL,
  `service_branch_id` int(11) NOT NULL,
  `service_created_isodt` varchar(30) NOT NULL,
  `service_updated_isodt` varchar(30) DEFAULT NULL,
  `service_created_by` int(11) NOT NULL,
  `service_status` enum('a','i','d') NOT NULL,
  `service_updated_by` int(11) NOT NULL DEFAULT 0,
  `service_vat_percent` double NOT NULL,
  `service_discount_percent` double NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_suppliers`
--

CREATE TABLE `tbl_suppliers` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `supplier_code` varchar(15) DEFAULT NULL,
  `supplier_type` enum('general','reguler') NOT NULL DEFAULT 'reguler',
  `supplier_institution_name` varchar(255) DEFAULT NULL,
  `supplier_address` text DEFAULT NULL,
  `supplier_mobile_no` varchar(16) DEFAULT NULL,
  `supplier_phone_no` varchar(16) DEFAULT NULL,
  `supplier_mail_address` varchar(30) DEFAULT NULL,
  `supplier_previous_due` double NOT NULL DEFAULT 0,
  `supplier_created_isodt` varchar(30) NOT NULL,
  `supplier_updated_isodt` varchar(30) DEFAULT NULL,
  `supplier_branch_id` int(11) NOT NULL,
  `supplier_created_by` int(11) NOT NULL,
  `supplier_updated_by` int(11) NOT NULL DEFAULT 0,
  `supplier_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_suppliers`
--

INSERT INTO `tbl_suppliers` (`supplier_id`, `supplier_name`, `supplier_code`, `supplier_type`, `supplier_institution_name`, `supplier_address`, `supplier_mobile_no`, `supplier_phone_no`, `supplier_mail_address`, `supplier_previous_due`, `supplier_created_isodt`, `supplier_updated_isodt`, `supplier_branch_id`, `supplier_created_by`, `supplier_updated_by`, `supplier_status`) VALUES
(1, 'Standard Group', 'S00001', 'reguler', 'Standard Group Ltd', 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', '+880 2 9862003', NULL, 10000, '2021-02-20T09:47:08.653Z', '2021-02-20T10:19:55.262Z', 1, 57, 57, 'active'),
(2, 'Masco Industries', 'S00002', 'reguler', 'Masco Industries Limited', 'House # 6, Road # 1, Sector # 3, Jashimuddin Avenue, Uttara, Dhaka-1230, Bangladesh.', '01711111119', '+88 02 8918082', NULL, 20000, '2021-02-20T09:49:21.950Z', '2021-02-20T10:20:13.316Z', 1, 57, 57, 'active'),
(3, 'Dekko Group', 'S00003', 'reguler', 'Dekko Group', 'uvastu Zenim Plaza, House#37 (4th Floor), Road#16 (Old 27), Dhanmondi R/A, Dhaka-1209, Bangladesh.', '01301010101', '02-9132934', NULL, 10000, '2021-02-20T09:55:01.973Z', '2021-02-20T10:20:34.734Z', 1, 57, 57, 'active'),
(4, 'Syed Group', 'S00004', 'reguler', 'Syed Group', 'Mohakhali, Dhaka 1212, Bangladesh.', '01812121213', '+88 02 8918087', NULL, 5000, '2021-02-20T09:56:22.108Z', '2021-02-20T10:20:52.874Z', 1, 57, 57, 'active'),
(5, 'Global Group', 'S00005', 'reguler', 'Global Group', 'Dhaka-1209, Bangladesh.', '01749508007', '', NULL, 2000, '2021-02-20T10:00:34.193Z', NULL, 1, 57, 0, 'active'),
(6, 'Sabbir Ltd', 'S00006', 'reguler', 'Sabbir Ltd', 'Mirpur, Dhaka Bangladesh.	', '01924238967', '', NULL, 3000, '2021-02-20T10:02:02.885Z', NULL, 1, 57, 0, 'active'),
(7, 'Alif Group', 'S00007', 'reguler', 'Alif Group', ' Dhanmondi Dhaka, Bangladesh.	', '01867897971', '', NULL, 1000, '2021-02-20T10:03:55.073Z', NULL, 1, 57, 0, 'active'),
(8, 'Habib Group', 'S00008', 'reguler', 'Habib Group', 'Mirpur, Dhaka Bangladesh.', '0175030390', '', NULL, 50000, '2021-02-20T10:06:08.323Z', NULL, 1, 57, 0, 'active'),
(9, 'Korim KDS', 'S00009', 'reguler', 'KDS Ltd', 'Gulshan,Dhaka Bangladesh.', '01700000091', '', NULL, 20000, '2021-02-20T10:09:16.021Z', NULL, 1, 57, 0, 'active'),
(10, 'World Group', 'S000010', 'reguler', 'World Group', 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', '', NULL, 15000, '2021-02-20T10:13:16.536Z', NULL, 1, 57, 0, 'active'),
(112, '', 'P000011', 'general', NULL, '', '', NULL, NULL, 0, '2021-02-20T13:26:47.317Z', NULL, 1, 57, 0, 'active'),
(113, '', 'P0000113', 'general', NULL, '', '', NULL, NULL, 0, '2021-02-20T13:27:05.741Z', NULL, 1, 57, 0, 'active'),
(114, '', 'P0000114', 'general', NULL, '', '', NULL, NULL, 0, '2021-02-20T13:27:59.222Z', NULL, 1, 57, 0, 'active'),
(115, 'Ma Baba Enterprise', 'S0000115', 'reguler', 'Ma Baba Enterprise', '', '', '', NULL, 0, '2021-03-27T05:04:31.592Z', NULL, 1, 57, 0, 'active'),
(116, 'World Group', 'P0000116', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(117, 'World Group', 'P0000117', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(118, 'World Group', 'P0000118', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(119, 'World Group', 'P0000119', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(120, 'World Group', 'P0000120', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(121, 'World Group', 'P0000121', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(122, 'World Group', 'P0000122', 'general', NULL, 'SHERE-E-BANGLA NAGOR, 7-E AGARGAON 1236, BANGLADESH', '01749508006', NULL, NULL, 0, '2021-06-20T17:39:42.607Z', NULL, 1, 57, 0, 'active'),
(123, 'Syed Group', 'P0000123', 'general', NULL, 'Mohakhali, Dhaka 1212, Bangladesh.', '01812121213', NULL, NULL, 0, '2021-06-21T07:08:10.861Z', NULL, 1, 57, 0, 'active'),
(124, 'Global Group', 'P0000124', 'general', NULL, 'Dhaka-1209, Bangladesh.', '01749508007', NULL, NULL, 0, '2021-06-21T06:54:20.682Z', NULL, 1, 57, 0, 'active'),
(125, 'Standard Group', 'P0000125', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(126, 'Standard Group', 'P0000126', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(127, 'Standard Group', 'P0000127', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(128, 'Standard Group', 'P0000128', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(129, 'Standard Group', 'P0000129', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(130, 'Standard Group', 'P0000130', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(131, 'Standard Group', 'P0000131', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(132, 'Standard Group', 'P0000132', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(133, 'Standard Group', 'P0000133', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(134, 'Standard Group', 'P0000134', 'general', NULL, 'Mohakhali C/A, Dhaka 1212, Bangladesh.', '01900000009', NULL, NULL, 0, '2021-06-21T11:29:51.472Z', NULL, 1, 57, 0, 'active'),
(135, '', 'P0000135', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-21T13:30:43.186Z', NULL, 1, 57, 0, 'active'),
(136, 'Rayhan', 'S0000136', 'reguler', '', '', '018', '', NULL, 0, '2021-06-23T05:57:54.000Z', NULL, 1, 57, 0, 'active'),
(137, 'Rayhan', 'P0000137', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-23T06:00:40.735Z', NULL, 1, 57, 0, 'active'),
(138, 'Rayhan', 'P0000138', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-23T06:00:40.735Z', NULL, 1, 57, 0, 'active'),
(139, 'Global Group', 'P0000139', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-23T06:17:56.865Z', NULL, 1, 57, 0, 'active'),
(140, 'ag', 'P0000140', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-23T06:17:56.865Z', NULL, 1, 57, 0, 'active'),
(141, 'ag', 'P0000141', 'general', NULL, 'gg', '443', NULL, NULL, 0, '2021-06-23T06:17:56.865Z', NULL, 1, 57, 0, 'active'),
(142, 'ag', 'P0000142', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-23T06:17:56.865Z', NULL, 1, 57, 0, 'active'),
(143, 'sabir', 'P0000143', 'general', NULL, '', '018', NULL, NULL, 0, '2021-06-23T06:36:31.223Z', NULL, 1, 57, 0, 'active'),
(144, '', 'P0000144', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-25T14:58:03.656Z', NULL, 1, 57, 0, 'active'),
(145, '', 'P0000145', 'general', NULL, '', '', NULL, NULL, 0, '2021-06-26T06:53:03.747Z', NULL, 1, 57, 0, 'active'),
(146, '', 'P0000146', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:46:31.457Z', NULL, 1, 57, 0, 'active'),
(147, '', 'P0000147', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:46:31.457Z', NULL, 1, 57, 0, 'active'),
(148, '', 'P0000148', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:46:31.457Z', NULL, 1, 57, 0, 'active'),
(149, '', 'P0000149', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:48:57.445Z', NULL, 1, 57, 0, 'active'),
(150, '', 'P0000150', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:48:57.445Z', NULL, 1, 57, 0, 'active'),
(151, '', 'P0000151', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(152, '', 'P0000152', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(153, '', 'P0000153', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(154, '', 'P0000154', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(155, '', 'P0000155', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(156, '', 'P0000156', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(157, '', 'P0000157', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(158, '', 'P0000158', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(159, '', 'P0000159', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(160, '', 'P0000160', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(161, '', 'P0000161', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(162, '', 'P0000162', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(163, '', 'P0000163', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(164, '', 'P0000164', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(165, '', 'P0000165', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T15:53:07.957Z', NULL, 1, 57, 0, 'active'),
(166, '', 'P0000166', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(167, '', 'P0000167', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(168, '', 'P0000168', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(169, '', 'P0000169', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(170, '', 'P0000170', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(171, '', 'P0000171', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(172, '', 'P0000172', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(173, '', 'P0000173', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(174, '', 'P0000174', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(175, '', 'P0000175', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(176, '', 'P0000176', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(177, '', 'P0000177', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(178, '', 'P0000178', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(179, '', 'P0000179', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(180, '', 'P0000180', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(181, '', 'P0000181', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(182, '', 'P0000182', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(183, '', 'P0000183', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(184, '', 'P0000184', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(185, '', 'P0000185', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(186, '', 'P0000186', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(187, '', 'P0000187', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(188, '', 'P0000188', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(189, '', 'P0000189', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(190, '', 'P0000190', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(191, '', 'P0000191', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(192, '', 'P0000192', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(193, '', 'P0000193', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(194, '', 'P0000194', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(195, '', 'P0000195', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:06:11.059Z', NULL, 1, 57, 0, 'active'),
(196, '', 'P0000196', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:54:55.546Z', NULL, 1, 57, 0, 'active'),
(197, '', 'P0000197', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:54:55.546Z', NULL, 1, 57, 0, 'active'),
(198, '', 'P0000198', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:54:55.546Z', NULL, 1, 57, 0, 'active'),
(199, '', 'P0000199', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T17:54:55.546Z', NULL, 1, 57, 0, 'active'),
(200, '', 'P0000200', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(201, '', 'P0000201', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(202, '', 'P0000202', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(203, '', 'P0000203', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(204, '', 'P0000204', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(205, '', 'P0000205', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(206, '', 'P0000206', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(207, '', 'P0000207', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(208, '', 'P0000208', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:05:04.475Z', NULL, 1, 57, 0, 'active'),
(209, '', 'P0000209', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(210, '', 'P0000210', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(211, '', 'P0000211', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(212, '', 'P0000212', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(213, '', 'P0000213', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(214, '', 'P0000214', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(215, '', 'P0000215', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(216, '', 'P0000216', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(217, '', 'P0000217', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(218, '', 'P0000218', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(219, '', 'P0000219', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(220, '', 'P0000220', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(221, '', 'P0000221', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(222, '', 'P0000222', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(223, '', 'P0000223', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(224, '', 'P0000224', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(225, '', 'P0000225', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(226, '', 'P0000226', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(227, '', 'P0000227', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(228, '', 'P0000228', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(229, '', 'P0000229', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(230, '', 'P0000230', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(231, '', 'P0000231', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(232, '', 'P0000232', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(233, '', 'P0000233', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(234, '', 'P0000234', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(235, '', 'P0000235', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(236, '', 'P0000236', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(237, '', 'P0000237', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(238, '', 'P0000238', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(239, '', 'P0000239', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(240, '', 'P0000240', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(241, '', 'P0000241', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(242, '', 'P0000242', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(243, '', 'P0000243', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(244, '', 'P0000244', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:25:00.274Z', NULL, 1, 57, 0, 'active'),
(245, '', 'P0000245', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(246, '', 'P0000246', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(247, '', 'P0000247', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(248, '', 'P0000248', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(249, '', 'P0000249', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(250, '', 'P0000250', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(251, '', 'P0000251', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(252, '', 'P0000252', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(253, '', 'P0000253', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(254, '', 'P0000254', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(255, '', 'P0000255', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(256, '', 'P0000256', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(257, '', 'P0000257', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(258, '', 'P0000258', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(259, '', 'P0000259', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(260, '', 'P0000260', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(261, '', 'P0000261', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(262, '', 'P0000262', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(263, '', 'P0000263', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(264, '', 'P0000264', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(265, '', 'P0000265', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(266, '', 'P0000266', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(267, '', 'P0000267', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(268, '', 'P0000268', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(269, '', 'P0000269', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(270, '', 'P0000270', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(271, '', 'P0000271', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(272, '', 'P0000272', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(273, '', 'P0000273', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(274, '', 'P0000274', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(275, '', 'P0000275', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(276, '', 'P0000276', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(277, '', 'P0000277', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T18:50:43.900Z', NULL, 1, 57, 0, 'active'),
(278, '', 'P0000278', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(279, '', 'P0000279', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(280, '', 'P0000280', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(281, '', 'P0000281', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(282, '', 'P0000282', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(283, '', 'P0000283', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(284, '', 'P0000284', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(285, '', 'P0000285', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(286, '', 'P0000286', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(287, '', 'P0000287', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(288, '', 'P0000288', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(289, '', 'P0000289', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(290, '', 'P0000290', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(291, '', 'P0000291', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(292, '', 'P0000292', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(293, '', 'P0000293', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(294, '', 'P0000294', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(295, '', 'P0000295', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(296, '', 'P0000296', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(297, '', 'P0000297', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(298, '', 'P0000298', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(299, '', 'P0000299', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(300, '', 'P0000300', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T19:54:40.629Z', NULL, 1, 57, 0, 'active'),
(301, '', 'P0000301', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T20:39:53.732Z', NULL, 1, 57, 0, 'active'),
(302, '', 'P0000302', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T20:50:31.054Z', NULL, 1, 57, 0, 'active'),
(303, '', 'P0000303', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T20:50:31.054Z', NULL, 1, 57, 0, 'active'),
(304, '', 'P0000304', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-05T20:52:15.602Z', NULL, 1, 57, 0, 'active'),
(305, '', 'P0000305', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T07:49:35.110Z', NULL, 1, 57, 0, 'active'),
(306, '', 'P0000306', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T07:49:35.110Z', NULL, 1, 57, 0, 'active'),
(307, '', 'P0000307', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T07:49:35.110Z', NULL, 1, 57, 0, 'active'),
(308, '', 'P0000308', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:26:13.851Z', NULL, 1, 57, 0, 'active'),
(309, '', 'P0000309', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:26:24.577Z', NULL, 1, 57, 0, 'active'),
(310, '', 'P0000310', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:26:13.851Z', NULL, 1, 57, 0, 'active'),
(311, '', 'P0000311', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:34:31.097Z', NULL, 1, 57, 0, 'active'),
(312, '', 'P0000312', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:34:50.154Z', NULL, 1, 57, 0, 'active'),
(313, '', 'P0000313', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T08:40:51.098Z', NULL, 1, 57, 0, 'active'),
(314, '', 'P0000314', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(315, '', 'P0000315', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(316, '', 'P0000316', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(317, '', 'P0000317', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(318, '', 'P0000318', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(319, '', 'P0000319', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(320, '', 'P0000320', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(321, '', 'P0000321', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(322, '', 'P0000322', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T09:08:54.029Z', NULL, 1, 57, 0, 'active'),
(323, '', 'P0000323', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T10:55:19.538Z', NULL, 1, 57, 0, 'active'),
(324, '', 'P0000324', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T11:08:00.721Z', NULL, 1, 57, 0, 'active'),
(325, '', 'P0000325', 'general', NULL, '', '', NULL, NULL, 0, '2021-08-07T11:08:00.721Z', NULL, 1, 57, 0, 'active'),
(326, 'A sup', 'S0000326', 'reguler', '', '', '018888', '', NULL, 0, '2022-02-13T06:04:06.909Z', NULL, 8, 57, 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_supplier_payments`
--

CREATE TABLE `tbl_supplier_payments` (
  `pay_id` int(11) NOT NULL,
  `pay_type` enum('payment','receive') NOT NULL,
  `pay_code` varchar(100) DEFAULT NULL,
  `pay_method` enum('cash','bank','cheque') NOT NULL,
  `bank_acc_id` int(11) NOT NULL DEFAULT 0,
  `supplier_id` int(11) NOT NULL,
  `pay_amount` double NOT NULL DEFAULT 0,
  `note` text DEFAULT NULL,
  `branch_id` int(11) NOT NULL,
  `previous_due` double NOT NULL DEFAULT 0,
  `created_isodt` varchar(30) NOT NULL,
  `updated_isodt` varchar(30) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT 0,
  `status` enum('a','d','p') NOT NULL DEFAULT 'a'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_supplier_payments`
--

INSERT INTO `tbl_supplier_payments` (`pay_id`, `pay_type`, `pay_code`, `pay_method`, `bank_acc_id`, `supplier_id`, `pay_amount`, `note`, `branch_id`, `previous_due`, `created_isodt`, `updated_isodt`, `created_by`, `updated_by`, `status`) VALUES
(1, 'payment', 'ST0001', 'cash', 0, 10, 50000, '', 1, 347100, '2021-02-20T14:29:08.350Z', '2021-02-20T14:29:24.656Z', 57, 0, 'a'),
(2, 'payment', 'ST0002', 'cash', 0, 10, 20000, '', 1, 10000, '2021-02-20T14:29:24.899Z', '2021-02-20T14:29:47.651Z', 57, 57, 'a'),
(3, 'receive', 'ST0003', 'cash', 0, 10, 500, '', 1, 275100, '2021-02-20T14:12:46.979Z', '2021-02-20T15:16:18.507Z', 57, 0, 'a'),
(4, 'payment', 'ST0004', 'bank', 2, 10, 2000, '', 1, 275600, '2021-02-20T14:00:18.742Z', '2021-02-20T15:17:14.963Z', 57, 0, 'a'),
(5, 'payment', 'ST0005', 'cash', 0, 10, 300, '', 1, 273600, '2021-02-20T14:04:15.288Z', '2021-02-20T15:18:59.520Z', 57, 0, 'a'),
(6, 'receive', 'ST0006', 'cash', 0, 10, 4000, '', 1, 273300, '2021-02-20T14:19:59.843Z', '2021-02-20T15:19:58.731Z', 57, 0, 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_accounts`
--

CREATE TABLE `tbl_transaction_accounts` (
  `tran_acc_id` int(11) NOT NULL,
  `tran_acc_code` varchar(50) NOT NULL,
  `tran_acc_name` varchar(255) NOT NULL,
  `tran_acc_note` text DEFAULT NULL,
  `tran_acc_created_isodt` varchar(30) NOT NULL,
  `tran_acc_updated_isodt` varchar(30) DEFAULT NULL,
  `tran_acc_created_by` int(11) NOT NULL,
  `tran_acc_updated_by` int(11) NOT NULL DEFAULT 0,
  `tran_acc_status` enum('active','deactivated','pending') NOT NULL DEFAULT 'active',
  `tran_acc_branch_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_transaction_accounts`
--

INSERT INTO `tbl_transaction_accounts` (`tran_acc_id`, `tran_acc_code`, `tran_acc_name`, `tran_acc_note`, `tran_acc_created_isodt`, `tran_acc_updated_isodt`, `tran_acc_created_by`, `tran_acc_updated_by`, `tran_acc_status`, `tran_acc_branch_id`) VALUES
(1, 'TA00001', 'Lunch', NULL, '2021-02-20T18:01:14.244Z', NULL, 57, 0, 'active', 1),
(2, 'TA00002', 'Office Rent', NULL, '2021-02-20T18:01:31.331Z', NULL, 57, 0, 'active', 1),
(3, 'TA00003', 'Utility bills', NULL, '2021-02-20T18:02:40.444Z', NULL, 57, 0, 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `user_id` int(11) NOT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_label` varchar(30) DEFAULT NULL,
  `user_password` text NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_role` enum('super_admin','admin','user') DEFAULT NULL,
  `user_access` text DEFAULT NULL,
  `user_created_iso_dt` varchar(50) DEFAULT NULL,
  `user_updated_iso_dt` varchar(50) DEFAULT NULL,
  `user_created_by` int(11) NOT NULL,
  `user_updated_by` int(11) DEFAULT NULL,
  `user_branch_id` int(11) NOT NULL,
  `user_warehouse_id` int(11) NOT NULL,
  `user_status` enum('active','deactivated','pending') DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_id`, `user_full_name`, `user_name`, `user_label`, `user_password`, `user_email`, `user_role`, `user_access`, `user_created_iso_dt`, `user_updated_iso_dt`, `user_created_by`, `user_updated_by`, `user_branch_id`, `user_warehouse_id`, `user_status`) VALUES
(58, 'SoftTask Rangpur', 'softtaskrangpur', 'super admin', '10ed64dc17d9efb2.8d5c49555a1c24f7f467f4a393b4c6399c71a0d2e017b072396694cad1fb965e6bff5f9c3b8875dc39053504481468d2dcab3de409b715cf1ba3d3e88e66750c', 'softtaskrangpur@gmail.com', 'super_admin', '[\"sales_entry\",\"customer_entry\",\"sales_record\",\"sales_invoice\",\"quotation_entry\",\"quotation_record\",\"quotation_invoice\",\"sales_return\",\"sales_return_record\",\"customer_due_list\",\"customer_list\",\"customer_ledger\",\"customer_transaction\",\"purchase_entry\",\"purchase_record\",\"purchase_invoice\",\"supplier_entry\",\"purchase_return\",\"purchase_return_list\",\"supplier_due_list\",\"supplier_list\",\"supplier_ledger\",\"supplier_transaction\",\"production_entry\",\"material_purchase\",\"material_entry\",\"material_names\",\"material_damage_entry\",\"production_invoice\",\"material_purchase_invoice\",\"material_stock\",\"material_ledger\",\"production_record\",\"material_purchase_record\",\"material_damage_list\",\"material_list\",\"product_stock\",\"material_stock_m\",\"product_transfer\",\"product_damage\",\"product_transfer_list\",\"product_receive_list\",\"product_damage_list\",\"product_price_list\",\"material_re_order_list\",\"product_re_order_list\",\"product_ledger\",\"r_cash_bank_balance\",\"r_profit_loss\",\"customer_transaction_invoice\",\"r_material_stock\",\"r_product_stock\",\"bank_account_ledger\",\"r_customer_ledger\",\"r_supplier_ledger\",\"r_material_ledger\",\"r_product_ledger\",\"r_supplier_due_list\",\"r_customer_due_list\",\"r_sales_invoice\",\"r_quotation_invoice\",\"r_purchase_invoice\",\"r_production_invoice\",\"r_material_purchase_invoice\",\"r_customer_transaction\",\"r_supplier_transaction\",\"r_cash_transaction\",\"r_bank_transaction\",\"r_salary_payment\",\"r_sales_record\",\"r_quotation_record\",\"r_purchase_record\",\"r_production_record\",\"r_material_pur_record\",\"r_prod_transfer_record\",\"r_prod_receive_record\",\"r_sales_return_list\",\"r_purchase_return_list\",\"r_customer_list\",\"r_supplier_list\",\"r_material_damage_list\",\"r_material_list\",\"r_product_damage_list\",\"r_product_list\",\"product_manage\",\"area_manage\",\"product_name_entry\",\"product_category\",\"product_unit\",\"user_manage\",\"branch_manage\",\"company_profile\",\"salary\",\"salary_report\",\"employee_manage\",\"designation_manage\",\"department_manage\",\"month_manage\",\"cash_transaction\",\"bank_transaction\",\"customer_transaction_m\",\"supplier_payment\",\"transaction_accounts\",\"bank_accounts\",\"cash_transaction_report_m\",\"bank_transaction_report_m\"]', '2021-02-20T19:15:14.846Z', '2021-02-20T19:15:14.846Z', 57, NULL, 6, 0, 'active'),
(57, 'SoftTask', 'softtask', 'super admin', '765d3bdc2e542e62.cd2a9a91dfdfc93e0c3b94d77745ac4aadfae3aae944e4f4da7134bde3f54ba76c4cabfac2058f1d789f86bb31f56b0914548003279fca9ec69b92cfc0882898', 'softtask.com@gmail.com', 'super_admin', '[\"sales_entry\",\"customer_entry\",\"sales_record\",\"sales_invoice\",\"quotation_entry\",\"quotation_record\",\"quotation_invoice\",\"sales_return\",\"sales_return_record\",\"customer_due_list\",\"customer_list\",\"customer_ledger\",\"customer_transaction\",\"purchase_entry\",\"purchase_record\",\"purchase_invoice\",\"supplier_entry\",\"purchase_return\",\"purchase_return_list\",\"supplier_due_list\",\"supplier_list\",\"supplier_ledger\",\"supplier_transaction\",\"production_entry\",\"material_purchase\",\"material_entry\",\"material_names\",\"material_damage_entry\",\"production_invoice\",\"material_purchase_invoice\",\"material_stock\",\"material_ledger\",\"production_record\",\"material_purchase_record\",\"material_damage_list\",\"material_list\",\"product_stock\",\"material_stock_m\",\"product_transfer\",\"product_damage\",\"product_transfer_list\",\"product_receive_list\",\"product_damage_list\",\"product_price_list\",\"material_re_order_list\",\"product_re_order_list\",\"product_ledger\",\"cash_transaction\",\"bank_transaction\",\"customer_transaction_m\",\"supplier_payment\",\"transaction_accounts\",\"bank_accounts\",\"cash_transaction_report_m\",\"bank_transaction_report_m\",\"salary\",\"salary_report\",\"employee_manage\",\"designation_manage\",\"department_manage\",\"month_manage\",\"product_manage\",\"area_manage\",\"product_name_entry\",\"product_category\",\"product_unit\",\"user_manage\",\"branch_manage\",\"company_profile\",\"r_cash_bank_balance\",\"r_profit_loss\",\"customer_transaction_invoice\",\"r_material_stock\",\"r_product_stock\",\"bank_account_ledger\",\"r_customer_ledger\",\"r_supplier_ledger\",\"r_material_ledger\",\"r_product_ledger\",\"r_supplier_due_list\",\"r_customer_due_list\",\"r_sales_invoice\",\"r_quotation_invoice\",\"r_purchase_invoice\",\"r_production_invoice\",\"r_material_purchase_invoice\",\"r_customer_transaction\",\"r_supplier_transaction\",\"r_cash_transaction\",\"r_bank_transaction\",\"r_salary_payment\",\"r_sales_record\",\"r_quotation_record\",\"r_purchase_record\",\"r_production_record\",\"r_material_pur_record\",\"r_prod_transfer_record\",\"r_prod_receive_record\",\"r_sales_return_list\",\"r_purchase_return_list\",\"r_customer_list\",\"r_supplier_list\",\"r_material_damage_list\",\"r_material_list\",\"r_product_damage_list\",\"r_product_list\",\"cash_transaction_d_w\",\"r_cash_statement\",\"cash_ledger\",\"daily_ledger\",\"service_entry\",\"service_expense_entry\",\"service_record\",\"service_expense_record\",\"service_invoice\",\"service_expense_invoice\",\"service_report\"]', '2021-02-20T07:29:22.745Z', '2021-03-09T20:35:18.928Z', 53, 57, 1, 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_warehouses`
--

CREATE TABLE `tbl_warehouses` (
  `warehouse_id` int(11) NOT NULL,
  `warehouse_name` varchar(255) NOT NULL,
  `warehouse_title` text NOT NULL,
  `warehouse_address` text NOT NULL,
  `warehouse_created_isodt` varchar(30) DEFAULT NULL,
  `warehouse_updated_isodt` varchar(30) DEFAULT NULL,
  `warehouse_created_by` int(11) NOT NULL DEFAULT 0,
  `warehouse_updated_by` int(11) NOT NULL DEFAULT 0,
  `warehouse_status` enum('active','deactivated','deleted') NOT NULL DEFAULT 'active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_warehouses`
--

INSERT INTO `tbl_warehouses` (`warehouse_id`, `warehouse_name`, `warehouse_title`, `warehouse_address`, `warehouse_created_isodt`, `warehouse_updated_isodt`, `warehouse_created_by`, `warehouse_updated_by`, `warehouse_status`) VALUES
(1, 'warehouse one', 'warehouse one', 'Dhaka', '2021-05-25T06:49:07.481Z', NULL, 57, 57, 'active'),
(2, 'warehouse two', 'warehouse two', 'Dhaka', '2021-05-25T06:49:24.633Z', NULL, 57, 57, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_areas`
--
ALTER TABLE `tbl_areas`
  ADD PRIMARY KEY (`area_id`);

--
-- Indexes for table `tbl_bank_accounts`
--
ALTER TABLE `tbl_bank_accounts`
  ADD PRIMARY KEY (`bank_acc_id`);

--
-- Indexes for table `tbl_bank_transactions`
--
ALTER TABLE `tbl_bank_transactions`
  ADD PRIMARY KEY (`bank_tran_id`);

--
-- Indexes for table `tbl_branches`
--
ALTER TABLE `tbl_branches`
  ADD PRIMARY KEY (`branch_id`);

--
-- Indexes for table `tbl_cash_deposit_withdraw_trans`
--
ALTER TABLE `tbl_cash_deposit_withdraw_trans`
  ADD PRIMARY KEY (`tran_id`);

--
-- Indexes for table `tbl_cash_transactions`
--
ALTER TABLE `tbl_cash_transactions`
  ADD PRIMARY KEY (`cash_tran_id`);

--
-- Indexes for table `tbl_checking`
--
ALTER TABLE `tbl_checking`
  ADD PRIMARY KEY (`check_id`);

--
-- Indexes for table `tbl_customers`
--
ALTER TABLE `tbl_customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `tbl_customer_payments`
--
ALTER TABLE `tbl_customer_payments`
  ADD PRIMARY KEY (`pay_id`);

--
-- Indexes for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `tbl_designations`
--
ALTER TABLE `tbl_designations`
  ADD PRIMARY KEY (`designation_id`);

--
-- Indexes for table `tbl_employees`
--
ALTER TABLE `tbl_employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `tbl_employee_payments`
--
ALTER TABLE `tbl_employee_payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `tbl_institution_profile`
--
ALTER TABLE `tbl_institution_profile`
  ADD PRIMARY KEY (`pro_id`);

--
-- Indexes for table `tbl_materials`
--
ALTER TABLE `tbl_materials`
  ADD PRIMARY KEY (`material_id`);

--
-- Indexes for table `tbl_materials_damage`
--
ALTER TABLE `tbl_materials_damage`
  ADD PRIMARY KEY (`damage_id`);

--
-- Indexes for table `tbl_material_names`
--
ALTER TABLE `tbl_material_names`
  ADD PRIMARY KEY (`material_name_id`);

--
-- Indexes for table `tbl_material_purchase`
--
ALTER TABLE `tbl_material_purchase`
  ADD PRIMARY KEY (`m_purchase_id`);

--
-- Indexes for table `tbl_material_purchase_details`
--
ALTER TABLE `tbl_material_purchase_details`
  ADD PRIMARY KEY (`m_pur_detail_id`);

--
-- Indexes for table `tbl_material_purchase_rate`
--
ALTER TABLE `tbl_material_purchase_rate`
  ADD PRIMARY KEY (`material_purchase_rate_id`);

--
-- Indexes for table `tbl_material_stock`
--
ALTER TABLE `tbl_material_stock`
  ADD PRIMARY KEY (`stock_id`);

--
-- Indexes for table `tbl_months`
--
ALTER TABLE `tbl_months`
  ADD PRIMARY KEY (`month_id`);

--
-- Indexes for table `tbl_production_products`
--
ALTER TABLE `tbl_production_products`
  ADD PRIMARY KEY (`prod_d_id`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`prod_id`),
  ADD KEY `products_all_rel_id_idx` (`prod_cat_id`,`prod_brand_id`,`prod_color_id`,`prod_unit_id`,`prod_name_id`);

--
-- Indexes for table `tbl_products_names`
--
ALTER TABLE `tbl_products_names`
  ADD PRIMARY KEY (`prod_name_id`);

--
-- Indexes for table `tbl_product_brands`
--
ALTER TABLE `tbl_product_brands`
  ADD PRIMARY KEY (`prod_brand_id`);

--
-- Indexes for table `tbl_product_categories`
--
ALTER TABLE `tbl_product_categories`
  ADD PRIMARY KEY (`prod_cat_id`);

--
-- Indexes for table `tbl_product_colors`
--
ALTER TABLE `tbl_product_colors`
  ADD PRIMARY KEY (`prod_color_id`);

--
-- Indexes for table `tbl_product_current_stock`
--
ALTER TABLE `tbl_product_current_stock`
  ADD PRIMARY KEY (`stock_id`);

--
-- Indexes for table `tbl_product_damage`
--
ALTER TABLE `tbl_product_damage`
  ADD PRIMARY KEY (`damage_id`);

--
-- Indexes for table `tbl_product_productions_details`
--
ALTER TABLE `tbl_product_productions_details`
  ADD PRIMARY KEY (`prod_d_id`);

--
-- Indexes for table `tbl_product_productions_master`
--
ALTER TABLE `tbl_product_productions_master`
  ADD PRIMARY KEY (`production_id`);

--
-- Indexes for table `tbl_product_purchase_rate`
--
ALTER TABLE `tbl_product_purchase_rate`
  ADD PRIMARY KEY (`product_purchase_rate_id`);

--
-- Indexes for table `tbl_product_sizes`
--
ALTER TABLE `tbl_product_sizes`
  ADD PRIMARY KEY (`prod_size_id`);

--
-- Indexes for table `tbl_product_transfer_details`
--
ALTER TABLE `tbl_product_transfer_details`
  ADD PRIMARY KEY (`transfer_d_id`);

--
-- Indexes for table `tbl_product_transfer_master`
--
ALTER TABLE `tbl_product_transfer_master`
  ADD PRIMARY KEY (`transfer_id`);

--
-- Indexes for table `tbl_product_units`
--
ALTER TABLE `tbl_product_units`
  ADD PRIMARY KEY (`prod_unit_id`);

--
-- Indexes for table `tbl_purchase_details`
--
ALTER TABLE `tbl_purchase_details`
  ADD PRIMARY KEY (`pur_d_id`);

--
-- Indexes for table `tbl_purchase_master`
--
ALTER TABLE `tbl_purchase_master`
  ADD PRIMARY KEY (`pur_id`);

--
-- Indexes for table `tbl_purchase_return`
--
ALTER TABLE `tbl_purchase_return`
  ADD PRIMARY KEY (`pur_return_id`);

--
-- Indexes for table `tbl_purchase_return_details`
--
ALTER TABLE `tbl_purchase_return_details`
  ADD PRIMARY KEY (`pur_return_d_id`);

--
-- Indexes for table `tbl_pur_ser_details`
--
ALTER TABLE `tbl_pur_ser_details`
  ADD PRIMARY KEY (`pur_ser_d_id`);

--
-- Indexes for table `tbl_pur_ser_master`
--
ALTER TABLE `tbl_pur_ser_master`
  ADD PRIMARY KEY (`pur_ser_id`);

--
-- Indexes for table `tbl_quotation_details`
--
ALTER TABLE `tbl_quotation_details`
  ADD PRIMARY KEY (`sale_d_id`);

--
-- Indexes for table `tbl_quotation_master`
--
ALTER TABLE `tbl_quotation_master`
  ADD PRIMARY KEY (`sale_id`);

--
-- Indexes for table `tbl_sales_details`
--
ALTER TABLE `tbl_sales_details`
  ADD PRIMARY KEY (`sale_d_id`);

--
-- Indexes for table `tbl_sales_master`
--
ALTER TABLE `tbl_sales_master`
  ADD PRIMARY KEY (`sale_id`);

--
-- Indexes for table `tbl_sales_return`
--
ALTER TABLE `tbl_sales_return`
  ADD PRIMARY KEY (`sale_return_id`);

--
-- Indexes for table `tbl_sales_return_details`
--
ALTER TABLE `tbl_sales_return_details`
  ADD PRIMARY KEY (`sale_return_d_id`);

--
-- Indexes for table `tbl_service_details`
--
ALTER TABLE `tbl_service_details`
  ADD PRIMARY KEY (`service_d_id`);

--
-- Indexes for table `tbl_service_master`
--
ALTER TABLE `tbl_service_master`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `tbl_suppliers`
--
ALTER TABLE `tbl_suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `tbl_supplier_payments`
--
ALTER TABLE `tbl_supplier_payments`
  ADD PRIMARY KEY (`pay_id`);

--
-- Indexes for table `tbl_transaction_accounts`
--
ALTER TABLE `tbl_transaction_accounts`
  ADD PRIMARY KEY (`tran_acc_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tbl_warehouses`
--
ALTER TABLE `tbl_warehouses`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_areas`
--
ALTER TABLE `tbl_areas`
  MODIFY `area_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3147;

--
-- AUTO_INCREMENT for table `tbl_bank_accounts`
--
ALTER TABLE `tbl_bank_accounts`
  MODIFY `bank_acc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_bank_transactions`
--
ALTER TABLE `tbl_bank_transactions`
  MODIFY `bank_tran_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_branches`
--
ALTER TABLE `tbl_branches`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_cash_deposit_withdraw_trans`
--
ALTER TABLE `tbl_cash_deposit_withdraw_trans`
  MODIFY `tran_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_cash_transactions`
--
ALTER TABLE `tbl_cash_transactions`
  MODIFY `cash_tran_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_checking`
--
ALTER TABLE `tbl_checking`
  MODIFY `check_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_customers`
--
ALTER TABLE `tbl_customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4069;

--
-- AUTO_INCREMENT for table `tbl_customer_payments`
--
ALTER TABLE `tbl_customer_payments`
  MODIFY `pay_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_designations`
--
ALTER TABLE `tbl_designations`
  MODIFY `designation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_employees`
--
ALTER TABLE `tbl_employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_employee_payments`
--
ALTER TABLE `tbl_employee_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_institution_profile`
--
ALTER TABLE `tbl_institution_profile`
  MODIFY `pro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_materials`
--
ALTER TABLE `tbl_materials`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_materials_damage`
--
ALTER TABLE `tbl_materials_damage`
  MODIFY `damage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_material_names`
--
ALTER TABLE `tbl_material_names`
  MODIFY `material_name_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_material_purchase`
--
ALTER TABLE `tbl_material_purchase`
  MODIFY `m_purchase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tbl_material_purchase_details`
--
ALTER TABLE `tbl_material_purchase_details`
  MODIFY `m_pur_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `tbl_material_purchase_rate`
--
ALTER TABLE `tbl_material_purchase_rate`
  MODIFY `material_purchase_rate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_material_stock`
--
ALTER TABLE `tbl_material_stock`
  MODIFY `stock_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tbl_months`
--
ALTER TABLE `tbl_months`
  MODIFY `month_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_production_products`
--
ALTER TABLE `tbl_production_products`
  MODIFY `prod_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `prod_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `tbl_products_names`
--
ALTER TABLE `tbl_products_names`
  MODIFY `prod_name_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `tbl_product_brands`
--
ALTER TABLE `tbl_product_brands`
  MODIFY `prod_brand_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_categories`
--
ALTER TABLE `tbl_product_categories`
  MODIFY `prod_cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_product_colors`
--
ALTER TABLE `tbl_product_colors`
  MODIFY `prod_color_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_current_stock`
--
ALTER TABLE `tbl_product_current_stock`
  MODIFY `stock_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `tbl_product_damage`
--
ALTER TABLE `tbl_product_damage`
  MODIFY `damage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_product_productions_details`
--
ALTER TABLE `tbl_product_productions_details`
  MODIFY `prod_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `tbl_product_productions_master`
--
ALTER TABLE `tbl_product_productions_master`
  MODIFY `production_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_product_purchase_rate`
--
ALTER TABLE `tbl_product_purchase_rate`
  MODIFY `product_purchase_rate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tbl_product_sizes`
--
ALTER TABLE `tbl_product_sizes`
  MODIFY `prod_size_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_product_transfer_details`
--
ALTER TABLE `tbl_product_transfer_details`
  MODIFY `transfer_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tbl_product_transfer_master`
--
ALTER TABLE `tbl_product_transfer_master`
  MODIFY `transfer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_product_units`
--
ALTER TABLE `tbl_product_units`
  MODIFY `prod_unit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_purchase_details`
--
ALTER TABLE `tbl_purchase_details`
  MODIFY `pur_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=640;

--
-- AUTO_INCREMENT for table `tbl_purchase_master`
--
ALTER TABLE `tbl_purchase_master`
  MODIFY `pur_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `tbl_purchase_return`
--
ALTER TABLE `tbl_purchase_return`
  MODIFY `pur_return_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_purchase_return_details`
--
ALTER TABLE `tbl_purchase_return_details`
  MODIFY `pur_return_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_pur_ser_details`
--
ALTER TABLE `tbl_pur_ser_details`
  MODIFY `pur_ser_d_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_pur_ser_master`
--
ALTER TABLE `tbl_pur_ser_master`
  MODIFY `pur_ser_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_quotation_details`
--
ALTER TABLE `tbl_quotation_details`
  MODIFY `sale_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_quotation_master`
--
ALTER TABLE `tbl_quotation_master`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_sales_details`
--
ALTER TABLE `tbl_sales_details`
  MODIFY `sale_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `tbl_sales_master`
--
ALTER TABLE `tbl_sales_master`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tbl_sales_return`
--
ALTER TABLE `tbl_sales_return`
  MODIFY `sale_return_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_sales_return_details`
--
ALTER TABLE `tbl_sales_return_details`
  MODIFY `sale_return_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_service_details`
--
ALTER TABLE `tbl_service_details`
  MODIFY `service_d_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_service_master`
--
ALTER TABLE `tbl_service_master`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_suppliers`
--
ALTER TABLE `tbl_suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=327;

--
-- AUTO_INCREMENT for table `tbl_supplier_payments`
--
ALTER TABLE `tbl_supplier_payments`
  MODIFY `pay_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_transaction_accounts`
--
ALTER TABLE `tbl_transaction_accounts`
  MODIFY `tran_acc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `tbl_warehouses`
--
ALTER TABLE `tbl_warehouses`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
