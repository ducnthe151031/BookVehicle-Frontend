import {useEffect, useRef, useState} from "react";
import {GoogleGenAI} from "@google/genai";

const Test = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBq_3GlnpHgtU3LhQmZPz1BgSvupVtOQGE" });


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Get AI response
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Cơ sở dữ liệu vehicle_rental_system\n"+"-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)\n" +
                    "--\n" +
                    "-- Host: localhost    Database: vehicle_rental_system\n" +
                    "-- ------------------------------------------------------\n" +
                    "-- Server version\t8.0.42\n" +
                    "\n" +
                    "/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n" +
                    "/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\n" +
                    "/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\n" +
                    "/*!50503 SET NAMES utf8 */;\n" +
                    "/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;\n" +
                    "/*!40103 SET TIME_ZONE='+00:00' */;\n" +
                    "/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;\n" +
                    "/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;\n" +
                    "/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\n" +
                    "/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `brands`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `brands`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `brands` (\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `name` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `brands`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `brands` WRITE;\n" +
                    "/*!40000 ALTER TABLE `brands` DISABLE KEYS */;\n" +
                    "INSERT INTO `brands` VALUES ('0f6d8a43-966e-47e6-bcfd-6f961a5566cb','Yamaha'),('198ceffc-cf40-45f1-b630-39435cb80817','Vinfast'),('1d4b00e5-4fc8-4833-8833-4d89cb2a90cf','Ford'),('2486647f-95b9-4e59-8999-6ae7e6625e30','Porsche'),('28a3c52c-1341-4d79-909c-669c8882e107','MG'),('3f9c98cc-92dd-4fa0-ba40-aad12a4c758c','Honda'),('63533e01-5726-465d-9f51-57c16a20f19f','BMW'),('8595b37b-a700-4602-8a51-49b0ed36420b','BMW'),('9eac4da2-d29f-48a7-924b-2b95baec51ea','Chervollet'),('a55baed2-c664-4d85-8f77-fa21897d60a8','Audi'),('aac43057-aa9f-4fb2-938f-19779bc8bb66','Vinfast'),('ab0cf2d9-0d32-45cf-a533-516ea618f60b','Mazda'),('b10b59e0-e8e9-41f2-b93c-3169a2246c46','Kia'),('b7c69b15-6f51-49d3-9e8c-8476224b2264','Vinfast'),('bb1e5acb-eac9-40ce-97e3-09db57e04d9b','Yamaha'),('cba949be-3335-4837-af35-f735576ad8da','Ducati'),('d1b4fa5f-7864-4719-974e-8c890ec796a2','Kawasaki'),('df89e603-694e-44a5-874e-a2691377ae01','Mercedes-Benz'),('fb52d150-e582-4552-8b48-d06f6ce32000','Toyota');\n" +
                    "/*!40000 ALTER TABLE `brands` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `categories`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `categories`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `categories` (\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `name` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `categories`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `categories` WRITE;\n" +
                    "/*!40000 ALTER TABLE `categories` DISABLE KEYS */;\n" +
                    "INSERT INTO `categories` VALUES ('015a2616-5132-4289-835a-5c1ef412064e','Bán Tải'),('0241329b-65db-4e5c-a414-dbeb84bfab7f','5 Chỗ'),('112997cb-78db-41eb-814d-067df9589247','SUV'),('1388330d-ae99-4a00-8c8b-72e00ad8307e','Coupe'),('765178aa-35f7-4ef3-a56c-29b30dd46d6b','4 Chỗ'),('bba1377d-5646-4da2-8989-aa01ec1b6bb1','7 Chỗ'),('bfe0aa9b-e419-40f6-a3a3-0ddb4413b216','Cross Over'),('e9407e98-3a83-45b9-b43f-55a67eadb031','Phân Khối Lớn (2 Chỗ)'),('f5b118af-ef65-4253-ba5d-66068e70d0db','Sedan'),('f9679089-c1a1-4500-bc21-6ffc303eac08','2 Chỗ');\n" +
                    "/*!40000 ALTER TABLE `categories` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `coupons`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `coupons`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `coupons` (\n" +
                    "  `discount_amount` decimal(18,2) NOT NULL,\n" +
                    "  `coupon_code` varchar(50) NOT NULL,\n" +
                    "  `id` varchar(255) NOT NULL,\n" +
                    "  PRIMARY KEY (`id`),\n" +
                    "  UNIQUE KEY `UKf1u99ssbdsqass9ntq968codg` (`coupon_code`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `coupons`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `coupons` WRITE;\n" +
                    "/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;\n" +
                    "INSERT INTO `coupons` VALUES (100000.00,'PVRS100','0f4672c7-6fde-43c6-8140-d5743bb79122'),(55000.00,'PV55','4b4bc530-977c-42d3-8e2e-93bbef50101c'),(50000.00,'PVRS50','691ab3f0-a297-4395-a12b-484acee5eeb4'),(150000.00,'TET150','998519e5-b650-435d-80f8-d71e57dce69b'),(10000.00,'PVRS10','9d8d15c5-a6ca-40b5-9e16-f3d624d2e47d'),(200000.00,'PVRS200','d4ba384e-6dee-4139-9d51-b20e14f03870');\n" +
                    "/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `discount_codes`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `discount_codes`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `discount_codes` (\n" +
                    "  `discount_amount` decimal(10,2) DEFAULT NULL,\n" +
                    "  `max_use` int DEFAULT NULL,\n" +
                    "  `used_count` int DEFAULT NULL,\n" +
                    "  `expiry_date` datetime(6) DEFAULT NULL,\n" +
                    "  `code` varchar(100) DEFAULT NULL,\n" +
                    "  `created_by` varchar(100) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `discount_codes`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `discount_codes` WRITE;\n" +
                    "/*!40000 ALTER TABLE `discount_codes` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `discount_codes` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `images`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `images`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `images` (\n" +
                    "  `uploaded_at` datetime(6) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `vehicle_id` varchar(100) DEFAULT NULL,\n" +
                    "  `url` varchar(500) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `images`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `images` WRITE;\n" +
                    "/*!40000 ALTER TABLE `images` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `images` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `notifications`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `notifications`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `notifications` (\n" +
                    "  `is_read` bit(1) DEFAULT NULL,\n" +
                    "  `created_at` datetime(6) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `title` varchar(100) DEFAULT NULL,\n" +
                    "  `type` varchar(100) DEFAULT NULL,\n" +
                    "  `user_id` varchar(100) DEFAULT NULL,\n" +
                    "  `message` tinytext,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `notifications`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `notifications` WRITE;\n" +
                    "/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `payments`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `payments`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `payments` (\n" +
                    "  `amount` int NOT NULL,\n" +
                    "  `is_payment` bit(1) DEFAULT NULL,\n" +
                    "  `id` bigint NOT NULL AUTO_INCREMENT,\n" +
                    "  `booking_id` varchar(255) NOT NULL,\n" +
                    "  `description` varchar(255) NOT NULL,\n" +
                    "  `url` varchar(255) NOT NULL,\n" +
                    "  `user_id` varchar(255) NOT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `payments`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `payments` WRITE;\n" +
                    "/*!40000 ALTER TABLE `payments` DISABLE KEYS */;\n" +
                    "INSERT INTO `payments` VALUES (300000,_binary '\\0',1,'bfb16859-2085-4b9e-84be-9a418c963f30','description','https://pay.payos.vn/web/17ee5e48250f4fa189e2e8241527f3b7','4ee2acd7-9332-47a7-ac56-850377915bf7'),(1500000,_binary '\\0',2,'2d7cbd0f-6e09-4703-a1a1-18e8433900c4','description','https://pay.payos.vn/web/2706603757764e9698739d0b1797f917','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',3,'9e26cbdd-f9d8-4866-921e-4b6684f9698f','description','https://pay.payos.vn/web/424cc9b36f2d46b9901caa0c143d8610','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',4,'19b0c77b-d1a7-44c6-8ce3-07044e22ee13','description','https://pay.payos.vn/web/b4997d752e1947bbac01bc76872689c5','4ee2acd7-9332-47a7-ac56-850377915bf7'),(300000,_binary '\\0',5,'aaf0c989-e6e1-4515-a293-bfff6bcaad8c','description','https://pay.payos.vn/web/3cc4af1ea44246669704449e24f46cbf','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',6,'73f0adce-47ad-4113-86e0-b61245210faf','description','https://pay.payos.vn/web/529e46d700eb4a5b9a6ca5b20f204f8f','4ee2acd7-9332-47a7-ac56-850377915bf7'),(4900000,_binary '\\0',7,'fa43797c-d510-49aa-a874-4544998b635b','description','https://pay.payos.vn/web/c5793df2dd7949ae8b8f093922b88c1b','4ee2acd7-9332-47a7-ac56-850377915bf7'),(5000000,_binary '\\0',8,'17b0e30d-aed1-449b-a9c6-98bab0750575','description','https://pay.payos.vn/web/f4f294bad3474a729add36c0e3cb18bb','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',9,'1e83c6c1-93a7-4c6f-88ad-7accacd8e08e','description','https://pay.payos.vn/web/738f739049244854a24378b6f8c48ec5','4ee2acd7-9332-47a7-ac56-850377915bf7'),(1000000,_binary '\\0',10,'a0517b4c-723b-49f1-9d33-197f6c4060b9','description','https://pay.payos.vn/web/2eea4f39c09546f0b030d7838133200a','4ee2acd7-9332-47a7-ac56-850377915bf7'),(350000,_binary '\\0',11,'2b017289-bfee-436a-9df8-df271c8ad1db','description','https://pay.payos.vn/web/fb707ee8765e4b28b77d1af9f500c3de','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',12,'b1e419b0-6b73-4774-bfda-84225e030f29','description','https://pay.payos.vn/web/1ad3101b4d784e3f8a7b6b3027446f34','4ee2acd7-9332-47a7-ac56-850377915bf7'),(200000,_binary '\\0',13,'a3bcc283-1a61-4592-a73b-b3fcd3034a58','description','https://pay.payos.vn/web/f84cf044d20743398cd984a70d561671','4ee2acd7-9332-47a7-ac56-850377915bf7'),(5000000,_binary '\\0',14,'6950fe50-1ff8-409c-b615-dee3fe250011','description','https://pay.payos.vn/web/2e06845b37824e3ba17fd21517e97fdd','4ee2acd7-9332-47a7-ac56-850377915bf7'),(100000,_binary '\\0',15,'c6031b15-ae3e-4309-b924-8cbac1b76baa','description','https://pay.payos.vn/web/f96a73683f8c4298a1192874e92f9457','4ee2acd7-9332-47a7-ac56-850377915bf7'),(100000,_binary '\\0',16,'866573d2-ef1c-4394-a9bd-f0b5cfe8793d','description','https://pay.payos.vn/web/895af4e2b8914df28389f8f8ef164382','4ee2acd7-9332-47a7-ac56-850377915bf7'),(100000,_binary '\\0',17,'c9558230-eb8b-482d-947e-f6b1b9c006e8','description','https://pay.payos.vn/web/8f5f6354525b417ca53a9b13cb76505b','4ee2acd7-9332-47a7-ac56-850377915bf7'),(7500000,_binary '\\0',18,'6ec5332e-6897-4548-84c5-c60ed17eb901','description','https://pay.payos.vn/web/ff166c6b610d4f85bfaf6528680f7808','4ee2acd7-9332-47a7-ac56-850377915bf7'),(700000,_binary '\\0',19,'39d69c32-44ea-4932-ae6f-405265a2692c','description','https://pay.payos.vn/web/3d1e613da6644348ac2a9d115b81938c','a08ed57f-198e-4573-a307-a5aa762d12a1'),(700000,_binary '\\0',20,'77dbf04e-ed88-4fdc-af95-00f020448214','description','https://pay.payos.vn/web/829e0c80236a47a4aa7939c383c0e6c5','a08ed57f-198e-4573-a307-a5aa762d12a1'),(700000,_binary '\\0',21,'82843e57-bcb5-4540-8acf-85be7aa2d7bd','description','https://pay.payos.vn/web/f352ed502bea4eb4b6713589505dac35','a08ed57f-198e-4573-a307-a5aa762d12a1'),(400000,_binary '\\0',22,'acd7fdfa-15f9-470e-a098-4580ad802f99','description','https://pay.payos.vn/web/6fc6467580ce452286339932eaf8714f','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',23,'b829bd4c-ca34-4586-85f0-d0c4f1c3261c','description','https://pay.payos.vn/web/9c875aad76514d239180e2b347c0f087','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',24,'4cb9a386-e0a9-4d19-a1cd-68d3f28d57de','description','https://pay.payos.vn/web/f48ac40859d942fa85b0132fbf927805','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',25,'60e818e5-4e3a-4539-8f11-b7a687958239','description','https://pay.payos.vn/web/8f5fe9ae23044746bc35992857883bfc','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',26,'7211bb40-66a6-451a-8609-b26469900c3e','description','https://pay.payos.vn/web/fdf00031b91f497a9b3f7ae925eb5219','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',27,'ef56f378-5ea8-4029-a582-ad82b0609d42','description','https://pay.payos.vn/web/82293268ac2e42a299fdfdadbd2a5f21','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',28,'85867d93-74c3-4a84-84a6-9912af8bc9dc','description','https://pay.payos.vn/web/4e13f3a4bb0c4c5bb0735aa0a6d1b895','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(400000,_binary '\\0',29,'cf70c4b1-5ec4-43eb-a823-f6c444a27655','description','https://pay.payos.vn/web/6d59e2e8ad354bcd8b4620864799c43d','6b59f416-d0b5-4d42-8d33-af59f25da4aa'),(50000,_binary '\\0',30,'c82a64bb-1d29-4511-8729-d4508637d29e','description','https://pay.payos.vn/web/8a971bba5dae479890bee130397ff09c','a08ed57f-198e-4573-a307-a5aa762d12a1');\n" +
                    "/*!40000 ALTER TABLE `payments` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `promotions`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `promotions`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `promotions` (\n" +
                    "  `discount_percent` int DEFAULT NULL,\n" +
                    "  `end_date` datetime(6) DEFAULT NULL,\n" +
                    "  `start_date` datetime(6) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `title` varchar(100) DEFAULT NULL,\n" +
                    "  `vehicle_id` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `promotions`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `promotions` WRITE;\n" +
                    "/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `rental_requests`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `rental_requests`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `rental_requests` (\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `customer_id` varchar(100) DEFAULT NULL,\n" +
                    "  `vehicle_id` varchar(100) DEFAULT NULL,\n" +
                    "  `start_date` datetime DEFAULT NULL,\n" +
                    "  `end_date` datetime DEFAULT NULL,\n" +
                    "  `status` varchar(100) DEFAULT NULL COMMENT 'PENDING, APPROVED,CANCELLED,COMPLETED',\n" +
                    "  `deposit_paid` tinyint(1) DEFAULT NULL,\n" +
                    "  `total_price` decimal(10,2) DEFAULT NULL,\n" +
                    "  `late_fee` decimal(10,2) DEFAULT NULL,\n" +
                    "  `created_at` datetime DEFAULT NULL,\n" +
                    "  `created_by` varchar(100) DEFAULT NULL,\n" +
                    "  `approved_by` varchar(100) DEFAULT NULL,\n" +
                    "  `brand_id` varchar(100) DEFAULT NULL,\n" +
                    "  `category_id` varchar(100) DEFAULT NULL,\n" +
                    "  `rent_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'DAY' COMMENT 'DAY',\n" +
                    "  `url` varchar(255) DEFAULT NULL,\n" +
                    "  `order_code` bigint DEFAULT NULL,\n" +
                    "  `payment_status` tinyint DEFAULT NULL,\n" +
                    "  `is_late` tinyint DEFAULT '0',\n" +
                    "  `late_fee_paid` tinyint DEFAULT '0',\n" +
                    "  `return_date` datetime DEFAULT NULL,\n" +
                    "  `delivery_status` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `rental_requests`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `rental_requests` WRITE;\n" +
                    "/*!40000 ALTER TABLE `rental_requests` DISABLE KEYS */;\n" +
                    "INSERT INTO `rental_requests` VALUES ('17b0e30d-aed1-449b-a9c6-98bab0750575','4ee2acd7-9332-47a7-ac56-850377915bf7','7095e697-7af0-43d8-8f39-0c3be1744b63','2025-07-24 09:00:00','2025-07-26 09:00:00','AVAILABLE',0,5000000.00,40800000.00,'2025-07-25 00:36:21','duck',NULL,'','e9407e98-3a83-45b9-b43f-55a67eadb031','day','https://pay.payos.vn/web/f4f294bad3474a729add36c0e3cb18bb',1753378581321,0,1,0,NULL,'RETURNED'),('19b0c77b-d1a7-44c6-8ce3-07044e22ee13','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-23 09:00:00','2025-07-23 12:00:00','AVAILABLE',0,200000.00,27300000.00,'2025-07-23 22:24:13','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/b4997d752e1947bbac01bc76872689c5',1753284253228,0,1,0,NULL,'RETURNED'),('1e83c6c1-93a7-4c6f-88ad-7accacd8e08e','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-24 09:00:00','2025-07-24 12:00:00','AVAILABLE',0,200000.00,24900000.00,'2025-07-25 01:19:13','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/738f739049244854a24378b6f8c48ec5',1753381152990,0,1,0,NULL,'RETURNED'),('2b017289-bfee-436a-9df8-df271c8ad1db','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-31 11:00:00','2025-07-31 15:00:00','PENDING',0,350000.00,5000.00,'2025-07-31 10:15:03','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/20f105b716c8453fb001a3d5da3b84c7',1754233398024,1,1,1,NULL,'RETURNED'),('2d7cbd0f-6e09-4703-a1a1-18e8433900c4','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-23 08:00:00','2025-07-23 23:00:00','AVAILABLE',0,1500000.00,26200000.00,'2025-07-23 22:20:37','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/2706603757764e9698739d0b1797f917',1753284037318,0,1,0,NULL,'RETURNED'),('39d69c32-44ea-4932-ae6f-405265a2692c','a08ed57f-198e-4573-a307-a5aa762d12a1','6e5c6bbf-df21-4f45-8efc-dad7b2186d59','2025-08-17 10:00:00','2025-08-17 13:00:00','PENDING',0,700000.00,5000.00,'2025-08-16 22:03:56','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/8e402919346f4f4092a7ae70d50a48b7',1755442888866,1,1,1,NULL,'RETURNED'),('4cb9a386-e0a9-4d19-a1cd-68d3f28d57de','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','PENDING',0,400000.00,NULL,'2025-08-17 22:16:10','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/f48ac40859d942fa85b0132fbf927805',1755443770445,1,0,0,NULL,'READY_TO_PICK'),('60e818e5-4e3a-4539-8f11-b7a687958239','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:12','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/8f5fe9ae23044746bc35992857883bfc',1755443771515,0,0,0,NULL,NULL),('6950fe50-1ff8-409c-b615-dee3fe250011','4ee2acd7-9332-47a7-ac56-850377915bf7','6e5c6bbf-df21-4f45-8efc-dad7b2186d59','2025-08-03 06:00:00','2025-08-03 23:00:00','AVAILABLE',0,5000000.00,21300000.00,'2025-08-03 22:50:12','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/2e06845b37824e3ba17fd21517e97fdd',1754236212241,0,1,0,NULL,NULL),('6ec5332e-6897-4548-84c5-c60ed17eb901','4ee2acd7-9332-47a7-ac56-850377915bf7','7095e697-7af0-43d8-8f39-0c3be1744b63','2025-08-11 09:00:00','2025-08-14 09:00:00','AVAILABLE',0,7500000.00,2200000.00,'2025-08-12 09:17:47','duck',NULL,'','e9407e98-3a83-45b9-b43f-55a67eadb031','day','https://pay.payos.vn/web/ff166c6b610d4f85bfaf6528680f7808',1754965067010,0,1,0,NULL,'RETURNED'),('7211bb40-66a6-451a-8609-b26469900c3e','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:12','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/fdf00031b91f497a9b3f7ae925eb5219',1755443771649,0,0,0,NULL,NULL),('73f0adce-47ad-4113-86e0-b61245210faf','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2028-01-23 09:00:00','2028-01-23 12:00:00','AVAILABLE',0,200000.00,NULL,'2025-07-23 22:25:47','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/529e46d700eb4a5b9a6ca5b20f204f8f',1753284347327,1,0,0,NULL,'DELIVERED'),('77dbf04e-ed88-4fdc-af95-00f020448214','a08ed57f-198e-4573-a307-a5aa762d12a1','6e5c6bbf-df21-4f45-8efc-dad7b2186d59','2025-08-17 10:00:00','2025-08-17 13:00:00','AVAILABLE',0,700000.00,2400000.00,'2025-08-16 22:04:00','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/829e0c80236a47a4aa7939c383c0e6c5',1755356639713,0,1,0,NULL,'RETURNED'),('82843e57-bcb5-4540-8acf-85be7aa2d7bd','a08ed57f-198e-4573-a307-a5aa762d12a1','6e5c6bbf-df21-4f45-8efc-dad7b2186d59','2025-08-17 10:00:00','2025-08-17 13:00:00','AVAILABLE',0,700000.00,2400000.00,'2025-08-16 22:04:00','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/f352ed502bea4eb4b6713589505dac35',1755356640385,0,1,0,NULL,'RETURNED'),('85867d93-74c3-4a84-84a6-9912af8bc9dc','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:14','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/4e13f3a4bb0c4c5bb0735aa0a6d1b895',1755443773624,0,0,0,NULL,NULL),('866573d2-ef1c-4394-a9bd-f0b5cfe8793d','4ee2acd7-9332-47a7-ac56-850377915bf7','e6599fb8-18e5-45e1-9aa4-cba0e9bd479b','2025-08-11 09:00:00','2025-08-11 12:00:00','AVAILABLE',0,100000.00,900000.00,'2025-08-10 13:36:46','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/f8b49000505645689fd15513779de005',1754967266684,1,1,1,NULL,'RETURNED'),('9e26cbdd-f9d8-4866-921e-4b6684f9698f','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-24 09:00:00','2025-07-24 12:00:00','AVAILABLE',0,200000.00,24900000.00,'2025-07-23 22:23:32','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/424cc9b36f2d46b9901caa0c143d8610',1753284211672,0,1,0,NULL,'RETURNED'),('a0517b4c-723b-49f1-9d33-197f6c4060b9','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-31 09:00:00','2025-08-02 09:00:00','AVAILABLE',0,1000000.00,3600000.00,'2025-07-31 09:52:43','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','day','https://pay.payos.vn/web/2eea4f39c09546f0b030d7838133200a',1753930363004,0,1,0,NULL,'RETURNED'),('a3bcc283-1a61-4592-a73b-b3fcd3034a58','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-08-03 09:00:00','2025-08-03 12:00:00','AVAILABLE',0,200000.00,5000000.00,'2025-08-03 22:48:25','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/f84cf044d20743398cd984a70d561671',1754236105409,0,1,0,NULL,'DELIVERED'),('aaf0c989-e6e1-4515-a293-bfff6bcaad8c','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-23 09:00:00','2025-07-23 12:00:00','AVAILABLE',0,300000.00,27300000.00,'2025-07-23 22:24:27','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/3cc4af1ea44246669704449e24f46cbf',1753284267330,0,1,0,NULL,'RETURNED'),('acd7fdfa-15f9-470e-a098-4580ad802f99','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:09','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/6fc6467580ce452286339932eaf8714f',1755443768670,0,0,0,NULL,NULL),('b1e419b0-6b73-4774-bfda-84225e030f29','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-08-03 09:00:00','2025-08-03 12:00:00','AVAILABLE',0,200000.00,5000000.00,'2025-08-03 22:47:46','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/1ad3101b4d784e3f8a7b6b3027446f34',1754236065848,0,1,0,NULL,'DELIVERED'),('b829bd4c-ca34-4586-85f0-d0c4f1c3261c','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:09','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/9c875aad76514d239180e2b347c0f087',1755443769487,0,0,0,NULL,NULL),('bfb16859-2085-4b9e-84be-9a418c963f30','4ee2acd7-9332-47a7-ac56-850377915bf7','ca2136df-74c3-4dab-8547-e82f72b681fb','2025-07-23 09:00:00','2025-07-23 12:00:00','AVAILABLE',0,300000.00,27300000.00,'2025-07-23 22:19:38','duck',NULL,'','f9679089-c1a1-4500-bc21-6ffc303eac08','hour','https://pay.payos.vn/web/17ee5e48250f4fa189e2e8241527f3b7',1753283977512,0,1,0,NULL,'RETURNED'),('c6031b15-ae3e-4309-b924-8cbac1b76baa','4ee2acd7-9332-47a7-ac56-850377915bf7','e6599fb8-18e5-45e1-9aa4-cba0e9bd479b','2025-08-11 09:00:00','2025-08-11 12:00:00','AVAILABLE',0,100000.00,900000.00,'2025-08-10 13:34:23','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/f96a73683f8c4298a1192874e92f9457',1754807662957,0,1,0,NULL,'RETURNED'),('c82a64bb-1d29-4511-8729-d4508637d29e','a08ed57f-198e-4573-a307-a5aa762d12a1','b95a0b58-8b48-4a98-85a7-061aa76c45dd','2025-08-18 10:00:00','2025-08-18 15:00:00','PENDING',0,50000.00,NULL,'2025-08-17 22:20:37','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/8a971bba5dae479890bee130397ff09c',1755444037031,1,0,0,NULL,'READY_TO_PICK'),('c9558230-eb8b-482d-947e-f6b1b9c006e8','4ee2acd7-9332-47a7-ac56-850377915bf7','e6599fb8-18e5-45e1-9aa4-cba0e9bd479b','2025-08-10 09:00:00','2025-08-10 12:00:00','AVAILABLE',0,100000.00,10000.00,'2025-08-10 21:07:40','duck',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/5cf861197c6a4794b3fcddd6545aedcf',1754836012639,1,1,1,'2025-08-10 21:27:58','RETURNED'),('cf70c4b1-5ec4-43eb-a823-f6c444a27655','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:14','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/6d59e2e8ad354bcd8b4620864799c43d',1755443773800,0,0,0,NULL,NULL),('ef56f378-5ea8-4029-a582-ad82b0609d42','6b59f416-d0b5-4d42-8d33-af59f25da4aa','c40764f9-c527-4d5f-a227-a018bfaaa534','2025-08-18 09:00:00','2025-08-18 12:00:00','AVAILABLE',0,400000.00,NULL,'2025-08-17 22:16:12','owner',NULL,'','765178aa-35f7-4ef3-a56c-29b30dd46d6b','hour','https://pay.payos.vn/web/82293268ac2e42a299fdfdadbd2a5f21',1755443771774,0,0,0,NULL,NULL),('fa43797c-d510-49aa-a874-4544998b635b','4ee2acd7-9332-47a7-ac56-850377915bf7','7095e697-7af0-43d8-8f39-0c3be1744b63','2025-07-24 09:00:00','2025-07-26 09:00:00','AVAILABLE',0,4900000.00,40800000.00,'2025-07-25 00:34:47','duck',NULL,'','e9407e98-3a83-45b9-b43f-55a67eadb031','day','https://pay.payos.vn/web/c5793df2dd7949ae8b8f093922b88c1b',1753378487307,0,1,0,NULL,'RETURNED');\n" +
                    "/*!40000 ALTER TABLE `rental_requests` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `reviews`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `reviews`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `reviews` (\n" +
                    "  `rating` int NOT NULL,\n" +
                    "  `created_at` datetime(6) NOT NULL,\n" +
                    "  `updated_at` datetime(6) NOT NULL,\n" +
                    "  `booking_id` varchar(255) DEFAULT NULL,\n" +
                    "  `comment` text,\n" +
                    "  `id` varchar(255) NOT NULL,\n" +
                    "  `user_id` varchar(255) NOT NULL,\n" +
                    "  `vehicle_id` varchar(255) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`),\n" +
                    "  UNIQUE KEY `UK3p9j9vyr1qofbcxju65es206r` (`booking_id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `reviews`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `reviews` WRITE;\n" +
                    "/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;\n" +
                    "INSERT INTO `reviews` VALUES (4,'2025-08-14 20:16:55.495092','2025-08-14 20:16:55.495092',NULL,'xe tốt','48145b6c-f575-48f8-ac46-31a81b654813','a08ed57f-198e-4573-a307-a5aa762d12a1','ca2136df-74c3-4dab-8547-e82f72b681fb'),(4,'2025-08-16 22:03:05.956273','2025-08-16 22:03:05.956273',NULL,'Xe tốt','4b61adb6-613e-4e9e-8312-7d9d10149f46','a08ed57f-198e-4573-a307-a5aa762d12a1','6e5c6bbf-df21-4f45-8efc-dad7b2186d59'),(4,'2025-08-16 22:35:22.524661','2025-08-16 22:35:22.524661',NULL,'Xe đẹp','8884b6dc-9e79-4767-9d0e-d3ef9e0f5de5','a08ed57f-198e-4573-a307-a5aa762d12a1','6e5c6bbf-df21-4f45-8efc-dad7b2186d59'),(5,'2025-08-17 21:48:00.042822','2025-08-17 21:48:00.042822',NULL,'Tuyệt vời\\n','b2a5eb24-bdcc-44c4-9c2c-351895cff681','a08ed57f-198e-4573-a307-a5aa762d12a1','85601389-8a09-47bd-8971-a664d5b5627b'),(4,'2025-08-14 20:17:13.472188','2025-08-14 20:17:13.472188',NULL,'xe cũ nhưng vẫn tốt','f4d6925c-22db-43b1-89fb-2d143f79cb15','a08ed57f-198e-4573-a307-a5aa762d12a1','85601389-8a09-47bd-8971-a664d5b5627b');\n" +
                    "/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `token`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `token`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `token` (\n" +
                    "  `expired` bit(1) NOT NULL DEFAULT b'0',\n" +
                    "  `revoked` bit(1) NOT NULL DEFAULT b'0',\n" +
                    "  `id` varchar(36) NOT NULL,\n" +
                    "  `user_id` varchar(36) NOT NULL,\n" +
                    "  `token_type` varchar(50) DEFAULT NULL,\n" +
                    "  `access_token` varchar(1000) NOT NULL,\n" +
                    "  `refresh_token` varchar(1000) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`),\n" +
                    "  KEY `FKe32ek7ixanakfqsdaokm4q9y2` (`user_id`),\n" +
                    "  CONSTRAINT `FKe32ek7ixanakfqsdaokm4q9y2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `token`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `token` WRITE;\n" +
                    "/*!40000 ALTER TABLE `token` DISABLE KEYS */;\n" +
                    "INSERT INTO `token` VALUES (_binary '',_binary '','02d66877-a16c-4d23-9a49-c40fe65408c9','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0MzUyNywiZXhwIjoxNzU1NTI5OTI3fQ.KdVQtlxUSqFGPT_-44TL3MyNNjrBjr5vsdHWcwpvWnQ',NULL),(_binary '',_binary '','033a1a96-1938-40b0-b7b7-2783aa81c19d','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc2OSwiZXhwIjoxNzU1NTMwMTY5fQ.QyMBSPArbI0SpC7kV2pxd6wfzeTQMT9W9C6T56FbUOQ',NULL),(_binary '',_binary '','03aba131-506a-481f-86b0-ccc566af9d72','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NTA5NjYyMiwiZXhwIjoxNzU1MTgzMDIyfQ.IkYThv_Nf8jgWThaNZqUyMMcPxAAhxB4fBpYcUJWUBo',NULL),(_binary '',_binary '','067b86ed-fada-492a-a3eb-a622addb0174','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4NTc1OSwiZXhwIjoxNzUzMzcyMTU5fQ.NLatNZTBt8kGziqEvpBoVi7IxtYaff5MxeVRAQG6kRo',NULL),(_binary '',_binary '','0dc4b056-a523-4c70-9368-7d92eaf36186','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnVwZGF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTA5NjYzMCwiZXhwIjoxNzU1MTgzMDMwfQ.VhNycUyIskF4barF6ErVZHdkCEOERjjy37mVLIODfjo',NULL),(_binary '',_binary '','0deee6ba-4d7d-4dcf-af32-646961eba3cb','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgzNjA1MCwiZXhwIjoxNzU0OTIyNDUwfQ.ZRUBMclA3TZBTujyJy4PwNqaAWKp1N0epJ9LklaTotw',NULL),(_binary '\\0',_binary '\\0','0e6b8044-fc40-4b9e-bbb0-f0be291eba21','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDUwNzgsImV4cCI6MTc1NTUzMTQ3OH0.1RToCTHRDx2znF7ldtPqzkS_ZvxiIhGIEqhcjpgWQR8',NULL),(_binary '',_binary '','141233ed-44ea-4df4-b3fb-75eda06d47d4','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDE0MTgsImV4cCI6MTc1NTUyNzgxOH0.Qg7MJC6rz3jM4LWhzIsQGIPpDE1SCKJb4d4Je6568L0',NULL),(_binary '\\0',_binary '\\0','150d18e9-7b58-42d7-839c-4675298bfe5d','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0NDI3MCwiZXhwIjoxNzU1NTMwNjcwfQ.XkJyI9JWn7CPYfBDxEo4ugnTtdFsukdYzjE9goioEaI',NULL),(_binary '\\0',_binary '\\0','15f17b44-1f8c-4cba-80ba-db90bc25e97e','115a8580-5087-4838-9f84-8aae54b2b4dc','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJOZ3V5ZW4iLCJwZXJtaXNzaW9uIjpbeyJhdXRob3JpdHkiOiJST0xFX1VTRVIifV0sImlhdCI6MTc1MzM3NDg0NCwiZXhwIjoxNzUzNDYxMjQ0fQ.S83zExgsdGresqxsrdmnos87SJF6DiPhxxOlJtIEeAM',NULL),(_binary '',_binary '','16968f52-e69f-49a6-99e5-33d9f7329fe6','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0MzEzMiwiZXhwIjoxNzU1NTI5NTMyfQ.VrCi2bxBxxUXa9ldXINwqL22oVEWi3s_Cz5897v_IOU',NULL),(_binary '',_binary '','1bfe2dda-090d-46f5-94d2-b80837f9a9fe','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0MDg2MiwiZXhwIjoxNzU1NTI3MjYyfQ.XLLvYXrkLkjgBA7bYnVNmg4pcpYEdGayGGgDz60Rx-E',NULL),(_binary '',_binary '','1d2e1f7f-dd23-486f-8184-1f5bcaa2d98b','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTY2NDAsImV4cCI6MTc1NTQ0MzA0MH0.PrwD619v1NrjeMriWJQB_Bb48C12vIH3mFaOq7W2s3g',NULL),(_binary '',_binary '','1d9b53cc-ca71-431f-a849-753582268ec7','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDA5ODMsImV4cCI6MTc1NTUyNzM4M30.BRPNRxyNcnJVKnHNKR909plIk3WTsbZ-Dxs6pORXRQ8',NULL),(_binary '',_binary '','1ebfa178-79a3-47e0-b3b7-6515d72619f9','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDMwODAsImV4cCI6MTc1NTUyOTQ4MH0.Taam0GyCWAUZFYWFckbLN49mhf4M2xH5A0Az2fuhWPw',NULL),(_binary '',_binary '','1f5718cc-aeb9-43e1-b8df-ed418ce18596','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUxMDExNDgsImV4cCI6MTc1NTE4NzU0OH0.bygmmQkxSp1Co4DId86xULJLSNs1jRiiaM2961dEimk',NULL),(_binary '\\0',_binary '\\0','20755fa7-e5a8-4a4b-9794-a01e3552c5c0','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NTQ0NDE4OSwiZXhwIjoxNzU1NTMwNTg5fQ.hA6TR41dJYDDZJlBXFZmiOIbGxOpqa5Ik5Gs1TSnnSk',NULL),(_binary '',_binary '','2230f1a1-e37c-46fa-875e-8ee2e595c64e','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDIzMzQ4MCwiZXhwIjoxNzU0MzE5ODgwfQ.o26YJUwkPIwYbAGHZExASGhvYZrPSmGFIg5ItdM5zGc',NULL),(_binary '',_binary '','22f28b53-dfdb-46e9-a6a8-190ca7c87f4d','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1MzI2MjczMywiZXhwIjoxNzUzMzQ5MTMzfQ.aZuS7hp3MfmHb1NeODa_SV_UKHJKXezCzuN1uqqEULo',NULL),(_binary '',_binary '','230236fd-eb6d-4ac0-9de2-2b4357d1a693','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzkyOTQ1MiwiZXhwIjoxNzU0MDE1ODUyfQ.KEo3QJtu4QloAb-zdOWefD8jPMX80Gig8vtrEPaRgUU',NULL),(_binary '',_binary '','25bf380a-8f2a-47c5-93fe-732e3a90a327','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0NDEyNywiZXhwIjoxNzU1NTMwNTI3fQ._yvaGMKzI4bxExQgm945XSYNfMXnWoob4eRO97SoIjY',NULL),(_binary '',_binary '','26af000e-aff2-4b5a-a890-5087b3c199e2','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUxNzcyNjYsImV4cCI6MTc1NTI2MzY2Nn0.Ou4Lj6SfgdrRemiEQcKtxjC7zg1af2LYFJt3YBrECSc',NULL),(_binary '',_binary '','28b8be65-e213-4c24-8731-8b27de05b555','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDk2NTg3NiwiZXhwIjoxNzU1MDUyMjc2fQ.wiFpY49aVmDFKwxDsCnjhA8_f8hVMnaLxhb_x5vkx-4',NULL),(_binary '',_binary '','28f7a5f2-fd04-4a20-8280-ed9abe4eba3f','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4NTEwOSwiZXhwIjoxNzUzMzcxNTA5fQ.cDJDooKg3TJ3zb1Y3Gj559kFmi14t22WfZq4zJK1LjA',NULL),(_binary '',_binary '','29133224-3af6-4af9-ab86-50463235a8d8','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3MiwiZXhwIjoxNzU1NTMwMTcyfQ.ZBljD1Ez8D5z3RZNRiD8w83Cy8x4q6AcQ1noLtQE4eI',NULL),(_binary '',_binary '','2e04dbee-f29c-4d7c-8745-5e9a63a132d2','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDMxNTcsImV4cCI6MTc1NTUyOTU1N30.jcUeqd0DgANw8SczMmiUm_XMmsZduHL9U-vU2gCllPU',NULL),(_binary '',_binary '','2e2ba6b2-6f8c-4b32-ba7f-076cc6a07b5d','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUxMDI1MDgsImV4cCI6MTc1NTE4ODkwOH0.q80MozUydqKUaSg72KVfZtzRQXCr3fn253bcJYLnB5o',NULL),(_binary '',_binary '','311d1d54-0e9f-4906-808f-f91d5fc51dfc','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDk2NjQ5NiwiZXhwIjoxNzU1MDUyODk2fQ.Oqan1ZwUWJbxPknbcBsvM3Wfl93JPqOktoWIehiEoRY',NULL),(_binary '',_binary '','34c869e3-a5a7-4011-bdd0-55c3f455b70a','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDkyNDA1MiwiZXhwIjoxNzU1MDEwNDUyfQ.aG16cQDbwCxFns7RYJCWWQDXEVSI-CVxfb7jcVCkU_I',NULL),(_binary '',_binary '','3941a3ff-26af-4a09-8443-057bdecffa2a','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTgzNjIsImV4cCI6MTc1NTQ0NDc2Mn0.Cky2eD-FU8JIhgr819nUmjD7FnKbSY9LuAkOQEt92f0',NULL),(_binary '',_binary '','3c1df2d7-9225-4f3b-9761-3ab1f1d6f039','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDI4ODUsImV4cCI6MTc1NTUyOTI4NX0.yNlS9eR4xoMn75ZqYdppqDAepRWDaF_C_S2B_5_cqeo',NULL),(_binary '',_binary '','3c5bf272-77b1-465a-9292-f7bd633e00a8','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDgzNjcwNiwiZXhwIjoxNzU0OTIzMTA2fQ.7d22RIuj8LpgWjTRCWUOkzsxhPlwUfAC7sbxdW8KGf8',NULL),(_binary '',_binary '','4547de90-0316-4b2e-b091-6d571fa7117c','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDk2NzAzNiwiZXhwIjoxNzU1MDUzNDM2fQ.-RgxtKGIz6aI53pIEOea8kDbI1VOaLn6YCKx5EShiII',NULL),(_binary '',_binary '','47261571-ca5d-43fa-86ff-d8f1372c7b50','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOnVwZGF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTM1ODUzNiwiZXhwIjoxNzU1NDQ0OTM2fQ.R3xfINMm1VDXiUzmb9H_mGlNAwBfywrfpI2-ThSnHL0',NULL),(_binary '',_binary '','4dc064cf-aab5-4de9-a1e4-7da6e50d49e1','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTY2MzcsImV4cCI6MTc1NTQ0MzAzN30.Vso-IivDAOoy9Sl1k0wxa9CC6RyLAhEGuPdxniRw2hc',NULL),(_binary '',_binary '','4e812a09-1728-48e8-b954-3b2c296338d0','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDIzMzQ5NywiZXhwIjoxNzU0MzE5ODk3fQ.iSalvftDyt2DnE4EA9oFEa_YxVvOiD_aE0iItIi0wiQ',NULL),(_binary '',_binary '','56812fa3-b6c9-47e9-979d-25cf8c39779b','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3MiwiZXhwIjoxNzU1NTMwMTcyfQ.ZBljD1Ez8D5z3RZNRiD8w83Cy8x4q6AcQ1noLtQE4eI',NULL),(_binary '',_binary '','5fd7343f-735a-40ad-8400-8ce9b169e694','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzkyOTg5OSwiZXhwIjoxNzU0MDE2Mjk5fQ.0JVNYXF2OS1jiSPf3BY75iicuAt3uwG4sG3TkCO1GaI',NULL),(_binary '',_binary '','623daa82-a5fe-4e8b-b371-362ddeeb2cc2','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTYxNTAsImV4cCI6MTc1NTQ0MjU1MH0.4-ba5fHm1Xsb3cqALqMX7HONe1Qhd4vYGrjlftWB3lk',NULL),(_binary '',_binary '','638d7608-a006-4992-86c0-32b952ecf606','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDI4MDAsImV4cCI6MTc1NTUyOTIwMH0.Pjun8sa6BlXPwJBtdSBf8KHVTibKWNvyrA-ihvUPVCE',NULL),(_binary '',_binary '','6b164c6c-02c1-4011-893c-8db84b5d26cb','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgwNzU4OSwiZXhwIjoxNzU0ODkzOTg5fQ.95mt5aDrrmB3TKGCoTb21P_yjtyiv1--N5VoKWgr3js',NULL),(_binary '',_binary '','6b206f45-d4e8-4acc-b171-a2982b9dde9a','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3MiwiZXhwIjoxNzU1NTMwMTcyfQ.ZBljD1Ez8D5z3RZNRiD8w83Cy8x4q6AcQ1noLtQE4eI',NULL),(_binary '',_binary '','6c478053-7536-4ba4-bd64-1f7e7032c86c','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUxMDExNzMsImV4cCI6MTc1NTE4NzU3M30.gpL7k0sgoaaVCpwn6jjEYqvawO6EDIHR6oAU6bpgPO0',NULL),(_binary '',_binary '','713758ab-6e3d-4c97-a70f-ffb5ebdce912','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDIzMTU3OCwiZXhwIjoxNzU0MzE3OTc4fQ.YFNii5HHnVTTtKKEp4vlPtHPXXg2DA4sdCZXrWv-oyM',NULL),(_binary '',_binary '','729ad806-c631-4c07-95bf-5a8b6a8ec476','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI2MjU2NiwiZXhwIjoxNzUzMzQ4OTY2fQ.Uec0ctEUSEfFG5dG2ikoRmOmc-WW3TiCHP21ctu5XHI',NULL),(_binary '',_binary '','763b9a8a-13f8-4093-8926-0a2393bd1072','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NTA5Njc2NSwiZXhwIjoxNzU1MTgzMTY1fQ.EWoevE-eo12GyH7yQ9B3QqrmqWt532l95PshoTIWHtQ',NULL),(_binary '',_binary '','7abc8ad2-e7f7-465c-b65a-acd59875f1f4','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDQwMzcsImV4cCI6MTc1NTUzMDQzN30.7iGjSpMuUb99iP6DFzPmxz-T5jobymaYIxtjA2q_JZg',NULL),(_binary '\\0',_binary '\\0','81ae6466-0703-46af-8f9d-03ffd857030e','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzg1NSwiZXhwIjoxNzU1NTMwMjU1fQ.YlqqrU7UaZchtjSkjYDPlbyTiBVuiA1RJxA-9ebtBIM',NULL),(_binary '',_binary '','87b9d4cf-6e21-4668-bfd9-30805edea24f','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1MzI2Njk3MiwiZXhwIjoxNzUzMzUzMzcyfQ.aDm_NR_mepoKMRBR0iXV1QVCNq6MJImyunX015UyqVI',NULL),(_binary '',_binary '','884be92f-1587-4d8c-aab3-056107f4b39e','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDU2NDc4NywiZXhwIjoxNzU0NjUxMTg3fQ.sWLVg4tOUm0DaUL9qV9gHnM8Vq9th2hfENCfWzQU6-8',NULL),(_binary '',_binary '','8c9f2813-c3df-42bf-afca-b1410f98b641','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1MzI2MjcwOCwiZXhwIjoxNzUzMzQ5MTA4fQ.pl2QyJnew0UDTqgVPZOf0jNh9w2BtGfmITfx-l4qQtc',NULL),(_binary '',_binary '','8d935049-56fe-46b6-acf4-e7630400b725','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTEwMzM3NiwiZXhwIjoxNzU1MTg5Nzc2fQ.pHDu5F7AqJAAEtclEHOFk1olcNIJsprLRLltBUNHA3o',NULL),(_binary '',_binary '','8ffb3137-13d1-4926-97a5-6177dc4658a3','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0MjU3NiwiZXhwIjoxNzU1NTI4OTc2fQ.FrtiV3PFrOOSTCX0cAzLr9BHVQ_zC802zILLP_nhYBE',NULL),(_binary '',_binary '','92e99a12-01b2-486c-b173-7a35514cf533','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDIzMTc5OCwiZXhwIjoxNzU0MzE4MTk4fQ.5YHpdR47gTdIulwD-p9XrPM1TW-6C-Ujh5SOmf4i54A',NULL),(_binary '',_binary '','935c4799-7aec-4c2e-bfdc-1ff07dd9d42c','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI2MzI0MywiZXhwIjoxNzUzMzQ5NjQzfQ.ckU5TOiY8QDkfMKSNmC7CM9A06foMF2SA0kzY79a92w',NULL),(_binary '',_binary '','93d63ebf-f608-48f5-8105-599ae14eb6ea','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnVwZGF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDU2NDMwMSwiZXhwIjoxNzU0NjUwNzAxfQ.-E2MkjBE6jpySg0SSQ5fkuLUZTIxA1-MuOAIIoI7lmk',NULL),(_binary '',_binary '','9a3ddbce-76dc-469d-8821-4e8fa5563d1c','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4NDczNCwiZXhwIjoxNzUzMzcxMTM0fQ.Y-BSLKAPnTReOm_p9R8AY5gXKYnsv3Myqc_OXLs0OuU',NULL),(_binary '',_binary '','9abcd684-4d5a-43fb-a611-c1467fb0934c','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3NCwiZXhwIjoxNzU1NTMwMTc0fQ.qlzV8C6lLnmkeKR-b_9-WO5NbzlKzzex_sAWJYWoRFE',NULL),(_binary '',_binary '','9e769da6-3965-42e8-8b5a-5eab5087b1fa','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTY2NDAsImV4cCI6MTc1NTQ0MzA0MH0.PrwD619v1NrjeMriWJQB_Bb48C12vIH3mFaOq7W2s3g',NULL),(_binary '',_binary '','a1423854-87f0-47ae-8a0e-e9598610890b','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzM3NDMwMywiZXhwIjoxNzUzNDYwNzAzfQ.Xk-dacoFx2E23EKJayUnReJioSrikoaBEAUKlY5zJ94',NULL),(_binary '',_binary '','a294be13-a61c-4800-be8c-848d2649f2a8','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4NTQ4NywiZXhwIjoxNzUzMzcxODg3fQ.qiGE5hc7QgdEbsHaJa3_VRtPSn7-ZK6DyyPbLAHlvjw',NULL),(_binary '',_binary '','a46770a7-5ffa-428b-b561-6ee68112e21b','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDE1MjAsImV4cCI6MTc1NTUyNzkyMH0.pn_JH_EdlwVRmDvB347O3R5xrApRO_UNG_YLcq_d1Kc',NULL),(_binary '',_binary '','a512b36b-a5fe-443e-90a2-dbf995a47c06','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTUzNTg1MTIsImV4cCI6MTc1NTQ0NDkxMn0.Px_8IDhv7iQ937E1-yeOL_bP5AtEHOlMvlN646k3ODk',NULL),(_binary '',_binary '','acaf5c9d-c5ae-4fea-afd7-98e595add49d','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDgzNjgzMiwiZXhwIjoxNzU0OTIzMjMyfQ.tbfQev_L-OV_d0eNSbpSavxN6mdKfzXA_PB8kR8y5eg',NULL),(_binary '',_binary '','ad793901-0218-4964-8c75-6f204513cff1','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0MjkyNiwiZXhwIjoxNzU1NTI5MzI2fQ.0R3rB1E5SMWtkN5lJAG_0gL78LDobrRrxzAd7rS-VKU',NULL),(_binary '',_binary '','ad9c794c-be55-42fd-8795-7995817ad7be','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46ZGVsZXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0MTQ1MSwiZXhwIjoxNzU1NTI3ODUxfQ.fhQIwNEmQchxKgmdnl07XRXk12TivYmn0KdyNlDyCYk',NULL),(_binary '',_binary '','b31727ba-3dd1-445e-9e08-87ed539e0d4b','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDgwNzE3OCwiZXhwIjoxNzU0ODkzNTc4fQ.DSDh30YJqXR92m5hAfpwZfIrH9TukALQAaTx8QebMLw',NULL),(_binary '',_binary '','b443bce6-38fb-4916-9961-a7676dd5e70c','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgzNTYzMiwiZXhwIjoxNzU0OTIyMDMyfQ.AAtXNI2c-J5nmM_6NSNnWtajBsWOEUwBrhbjvWhF1JM',NULL),(_binary '',_binary '','b975eec8-a917-4327-80dd-e34150bd569b','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4Mzc0NiwiZXhwIjoxNzUzMzcwMTQ2fQ.OFw0Pw4O8WtfHvBGBAL2EVGEGsksrVxmVLNB0PZIYU0',NULL),(_binary '',_binary '','bc651f16-96b7-4f82-a1bc-5fdfc3b8c271','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzM3NTkwMywiZXhwIjoxNzUzNDYyMzAzfQ.oxjKECS9OH-NDGkZQ-BUpv8-cWl5TiKhPUdE5dg43Q4',NULL),(_binary '',_binary '','bccea78f-548f-4fcb-94c1-008f8ec880d5','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1MzI4MjM1MywiZXhwIjoxNzUzMzY4NzUzfQ.u-IZgS9kbC4GNTSzFcYDgMHOR5YIkZhBgMnBGSnNUhI',NULL),(_binary '',_binary '','bffee0bd-8fc4-4d30-a4de-1aeea9485da0','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpjcmVhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDY0MTI1MCwiZXhwIjoxNzU0NzI3NjUwfQ.NfCka3ivU1pN9M8M1X23m8q1aEEiopUF-IeK2lxlIcM',NULL),(_binary '',_binary '','c2f651b7-776a-4d36-bb3e-18d6f6bce933','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzI4NTk2MCwiZXhwIjoxNzUzMzcyMzYwfQ.a9JN9WBlz19f5fChpYnr4akmbx9gqIPJ1L2GGPISoH8',NULL),(_binary '\\0',_binary '\\0','c3b5345f-c895-4967-887d-753323ac4e01','3af6999d-6439-4bd3-a268-697c3ed606d5','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoZSIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfVVNFUiJ9XSwiaWF0IjoxNzU0NjM3OTMxLCJleHAiOjE3NTQ3MjQzMzF9.zngpbXyaMB4M5Jqseskt_F1P6Naen9osqNzbSH19AXQ',NULL),(_binary '',_binary '','c40bf289-9c1c-492f-9f4c-9e13aa0a0010','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzkzMDQ0NywiZXhwIjoxNzU0MDE2ODQ3fQ.sgDfllhHPmqH_Xz-5JmsT5JdYt-GLsIVvxilOqEV1nI',NULL),(_binary '',_binary '','c62d1639-915a-4813-be23-c0cb31a8a496','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgzNTY2NywiZXhwIjoxNzU0OTIyMDY3fQ.x4j5uY0nkhF90jCaMds7komga1o78XruUWIyeqWixJs',NULL),(_binary '',_binary '','c71c86e3-4999-4c3c-ad63-1b539183f1c8','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6ImFkbWluOnVwZGF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTM1ODQ2NCwiZXhwIjoxNzU1NDQ0ODY0fQ.IBKhx45ePn1aZMQmCfuVceFro-jY1obVic5c8QWk5Ls',NULL),(_binary '',_binary '','cb014143-4baf-46e0-a9b3-fa2ed4eef18c','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpyZWFkIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1MzkzMTg4MSwiZXhwIjoxNzU0MDE4MjgxfQ.jt1plpVxRtk6yoSS_E8sfiCQSTrBNPOc6nqSc12E7JM',NULL),(_binary '',_binary '','cec140b3-4235-4cd9-8201-8f1aeb37ee7d','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3MCwiZXhwIjoxNzU1NTMwMTcwfQ.tlQX8jewYR5X9ThTTfDHSbBfG2X1XRqHT-_J8KB9l5I',NULL),(_binary '',_binary '','d51e5807-663a-4293-b9ae-8d03daab18f9','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0MzI1MCwiZXhwIjoxNzU1NTI5NjUwfQ.woelYN_7c5wUQUmgbh-anBUsBZX-TrNEsUDrZBYtFTE',NULL),(_binary '',_binary '','d69d4078-a78e-4e3c-abc4-a2ad51fa3d9c','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOnVwZGF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTE3NzYzMywiZXhwIjoxNzU1MjY0MDMzfQ.lDqsnDnrSbTWXyFTvQzuT-iKGxvwhW_AYAPVzzaX4x8',NULL),(_binary '',_binary '','ddc8fab6-5394-4659-a8e3-aa073337cde5','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDQxMDgsImV4cCI6MTc1NTUzMDUwOH0.lXozpCEgOkqGCIM_wntpwzVHWRMsmRNhESaXrVEFB8k',NULL),(_binary '',_binary '','e281246f-838d-47d1-9670-6784ad4c7f58','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmRlbGV0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46cmVhZCJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46Y3JlYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjp1cGRhdGUifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NTQ0MjY4NywiZXhwIjoxNzU1NTI5MDg3fQ.6wriUZoDcjSGGvUUy3KJk2CJTDuw4BBURorZZst6VN8',NULL),(_binary '',_binary '','e4f07d24-fc6b-4078-bbcc-2c66199eb926','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgwNzkxNiwiZXhwIjoxNzU0ODk0MzE2fQ.v_l2P1t1zzl6UJP3qqRnZoSML6_Liz3D2bRMI7U0QUA',NULL),(_binary '',_binary '','ec2254cc-b0bd-49c0-b4c8-45673ddc5eb0','7c80e262-ece5-4d76-ab1e-8eaa373904cf','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6ImFkbWluOmNyZWF0ZSJ9LHsiYXV0aG9yaXR5IjoiYWRtaW46dXBkYXRlIn0seyJhdXRob3JpdHkiOiJhZG1pbjpkZWxldGUifSx7ImF1dGhvcml0eSI6ImFkbWluOnJlYWQifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc1NDgwNzMzMiwiZXhwIjoxNzU0ODkzNzMyfQ.BaoltnbMsrhMJ_aHBVnuQs1MhV7_iFD-ypyip3CoPjA',NULL),(_binary '',_binary '','edbc3100-2d2f-45bb-8b42-3acace1fce02','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDA3NjksImV4cCI6MTc1NTUyNzE2OX0.2S-VpvkiGnwmerUV_o2ChzZ0i6pEW-xM5kVogGB2X80',NULL),(_binary '',_binary '','ee086325-4378-4bc2-b09f-9707864c8867','20569051-1621-4e17-9ee7-bd9670eca0da','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvcGVyYXRvciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1BFUkFUT1IifV0sImlhdCI6MTc1NDgwNzUzMywiZXhwIjoxNzU0ODkzOTMzfQ.P57E7EYX1WrWssEFPbumgpQANhX80Ncn49BvDLeLqWg',NULL),(_binary '',_binary '','ee438cef-9f9e-4767-ab4f-3e40a266e057','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3MSwiZXhwIjoxNzU1NTMwMTcxfQ.lqCWhi8Sk2IBRE4-ac7P5GPeeVWkJdRUFBLcTMVdNFU',NULL),(_binary '',_binary '','f4477b62-61e1-496a-9419-bdf61392855b','a08ed57f-198e-4573-a307-a5aa762d12a1','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNrIiwicGVybWlzc2lvbiI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NTU0NDM4NzEsImV4cCI6MTc1NTUzMDI3MX0.3KXnPKDbw5Jso-n_1cGuuJ6_JFPYReOhL8hNvuzsDZ4',NULL),(_binary '',_binary '','f5a1019b-a868-4e06-b54f-196080125b8d','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NTQ0Mzc3NCwiZXhwIjoxNzU1NTMwMTc0fQ.qlzV8C6lLnmkeKR-b_9-WO5NbzlKzzex_sAWJYWoRFE',NULL),(_binary '',_binary '','f6cc3ead-ab3d-490f-ba39-e89ae77f83b6','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDgzNzA5OCwiZXhwIjoxNzU0OTIzNDk4fQ.0pCL9rjeorz6k2QlBW0UW4deSkSU0FXOkDFd8UlCPqw',NULL),(_binary '',_binary '','f6e8c26b-cc3c-4fa6-8881-3c2e84f2416c','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BEARER','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lciIsInBlcm1pc3Npb24iOlt7ImF1dGhvcml0eSI6IlJPTEVfT1dORVIifV0sImlhdCI6MTc1NDk2NjkzOSwiZXhwIjoxNzU1MDUzMzM5fQ.t9-NkD4C1fWWFuCu4FXI6VAqCFxhA0Ww4t7o_dz9qzU',NULL);\n" +
                    "/*!40000 ALTER TABLE `token` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `user`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `user`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `user` (\n" +
                    "  `created_at` datetime(6) DEFAULT NULL,\n" +
                    "  `updated_at` datetime(6) DEFAULT NULL,\n" +
                    "  `id` varchar(36) NOT NULL,\n" +
                    "  `username` varchar(45) DEFAULT NULL,\n" +
                    "  `address` varchar(100) DEFAULT NULL,\n" +
                    "  `avartar_url` varchar(100) DEFAULT NULL,\n" +
                    "  `email` varchar(100) NOT NULL,\n" +
                    "  `flag_active` varchar(100) NOT NULL DEFAULT 'INACTIVE',\n" +
                    "  `full_name` varchar(100) DEFAULT NULL,\n" +
                    "  `password` varchar(100) DEFAULT NULL,\n" +
                    "  `phone_number` varchar(100) DEFAULT NULL,\n" +
                    "  `citizen_id_card_url` varchar(255) DEFAULT NULL,\n" +
                    "  `driver_license_url` varchar(255) DEFAULT NULL,\n" +
                    "  `role` varchar(255) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `user`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `user` WRITE;\n" +
                    "/*!40000 ALTER TABLE `user` DISABLE KEYS */;\n" +
                    "INSERT INTO `user` VALUES ('2025-07-24 16:34:04.198436',NULL,'115a8580-5087-4838-9f84-8aae54b2b4dc','Nguyen',NULL,NULL,'duck1@gmail.com','INACTIVE',NULL,'$2a$10$ye3zmXEGqRpDIrX4794grO8DcCwKcSz5rRQzrJzVr94N98ezCv3JW',NULL,NULL,NULL,'USER'),('2025-08-10 06:32:13.911170',NULL,'20569051-1621-4e17-9ee7-bd9670eca0da','operator',NULL,NULL,'duck22@gmail.com','ACTIVE',NULL,'$2a$10$4wSKRvl7vuEC4gyAasJrke4q5Rxgq2wF8acDZmAuCFeRXmpWwezCi',NULL,NULL,NULL,'OPERATOR'),('2025-08-08 07:25:31.049336',NULL,'3af6999d-6439-4bd3-a268-697c3ed606d5','he',NULL,NULL,'ducnt@gmail.com','INACTIVE',NULL,'$2a$10$WcH.HqMGsern4rh64I792OFPIgJgAtgJ1TxUe7tgv4XMuQg1kAz02',NULL,NULL,NULL,'USER'),('2025-07-23 09:25:08.775065',NULL,'6b59f416-d0b5-4d42-8d33-af59f25da4aa','owner','Hà Nội',NULL,'cbdcinema222@gmail.com','ACTIVE','Nguyen Van Mau','$2a$10$yWpXlzGGdeNYArLdzobonOM/FX6mRQEdzgc3JwLWittO/V1yJa9Ci','0364185732','aa6b412b-156c-4e4a-bad0-ff8f6153a0e7.png',NULL,'OWNER'),('2025-07-23 09:22:46.023202',NULL,'7c80e262-ece5-4d76-ab1e-8eaa373904cf','admin','Hà Nội','5b42b8bd-1b6a-4a30-b46d-e516b395e78a.png','ducnthe151031@fpt.edu.vn','ACTIVE','Nguyễn Thế Đức','$2a$10$HY7fdfXr309yiAZCDCVMheEPM.wko89UqioKV9IWi9v4xcxcvr0G6','0364185257',NULL,NULL,'ADMIN'),('2025-08-13 16:05:48.551175',NULL,'a08ed57f-198e-4573-a307-a5aa762d12a1','duck','Hà Nội','f71eca54-c52f-4372-ba48-8b4dec217363.png','maususu11@gmail.com','ACTIVE','Nguyễn Thế Đức','$2a$10$Ax.OtBa597brChiAz5L0NeXVRxKfe4vEgjHEC7ea4rGD4k1o4Pl12','036418527','06732d9b-98d0-4548-bd1c-cd2f16453d20.png','7d0a611d-eb64-4c72-95b9-ff59deb760a5.png','USER');\n" +
                    "/*!40000 ALTER TABLE `user` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `user_transactions`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `user_transactions`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `user_transactions` (\n" +
                    "  `created_at` datetime(6) DEFAULT NULL,\n" +
                    "  `action` varchar(100) DEFAULT NULL,\n" +
                    "  `description` varchar(100) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `user_id` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `user_transactions`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `user_transactions` WRITE;\n" +
                    "/*!40000 ALTER TABLE `user_transactions` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `user_transactions` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `vehicle_reviews`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `vehicle_reviews`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `vehicle_reviews` (\n" +
                    "  `rating` int DEFAULT NULL,\n" +
                    "  `created_at` datetime(6) DEFAULT NULL,\n" +
                    "  `created_by` varchar(100) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `user_id` varchar(100) DEFAULT NULL,\n" +
                    "  `vehicle_id` varchar(100) DEFAULT NULL,\n" +
                    "  `comment` tinytext,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `vehicle_reviews`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `vehicle_reviews` WRITE;\n" +
                    "/*!40000 ALTER TABLE `vehicle_reviews` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `vehicle_reviews` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `vehicle_type`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `vehicle_type`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `vehicle_type` (\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `type` varchar(100) DEFAULT NULL,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `vehicle_type`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `vehicle_type` WRITE;\n" +
                    "/*!40000 ALTER TABLE `vehicle_type` DISABLE KEYS */;\n" +
                    "/*!40000 ALTER TABLE `vehicle_type` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "\n" +
                    "--\n" +
                    "-- Table structure for table `vehicles`\n" +
                    "--\n" +
                    "\n" +
                    "DROP TABLE IF EXISTS `vehicles`;\n" +
                    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
                    "/*!50503 SET character_set_client = utf8mb4 */;\n" +
                    "CREATE TABLE `vehicles` (\n" +
                    "  `approved` tinyint(1) DEFAULT NULL,\n" +
                    "  `price_per_day` decimal(10,2) DEFAULT NULL,\n" +
                    "  `price_per_hour` decimal(38,2) DEFAULT NULL,\n" +
                    "  `seat_count` int DEFAULT NULL,\n" +
                    "  `created_at` datetime(6) DEFAULT NULL,\n" +
                    "  `branch_id` varchar(100) DEFAULT NULL,\n" +
                    "  `category_id` varchar(100) DEFAULT NULL,\n" +
                    "  `created_by` varchar(100) DEFAULT NULL,\n" +
                    "  `fuel_type` varchar(100) DEFAULT NULL,\n" +
                    "  `gear_box` varchar(100) DEFAULT NULL,\n" +
                    "  `id` varchar(100) NOT NULL,\n" +
                    "  `image_url` longtext,\n" +
                    "  `liecense_plate` varchar(100) DEFAULT NULL,\n" +
                    "  `location` varchar(100) DEFAULT NULL,\n" +
                    "  `owner_id` varchar(100) DEFAULT NULL,\n" +
                    "  `reason` varchar(100) DEFAULT NULL,\n" +
                    "  `status` varchar(100) DEFAULT NULL,\n" +
                    "  `user_id` varchar(100) DEFAULT NULL,\n" +
                    "  `vehicle_name` varchar(100) DEFAULT NULL,\n" +
                    "  `vehicle_type_id` varchar(100) DEFAULT NULL,\n" +
                    "  `registration_document_url` varchar(255) DEFAULT NULL,\n" +
                    "  `description` tinytext,\n" +
                    "  PRIMARY KEY (`id`)\n" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\n" +
                    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
                    "\n" +
                    "--\n" +
                    "-- Dumping data for table `vehicles`\n" +
                    "--\n" +
                    "\n" +
                    "LOCK TABLES `vehicles` WRITE;\n" +
                    "/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;\n" +
                    "INSERT INTO `vehicles` VALUES (1,1000000.00,100000.00,4,'2025-08-14 21:51:38.075331','ab0cf2d9-0d32-45cf-a533-516ea618f60b','765178aa-35f7-4ef3-a56c-29b30dd46d6b','admin','Gasoline','AUTOMATIC','1425c884-b5e0-4e90-8419-6159ef6c025d','7b138b96-cb4e-42e7-a41c-db70cd16455a.png','29A-02930','Hà Nội',NULL,'','AVAILABLE','7c80e262-ece5-4d76-ab1e-8eaa373904cf','Mazda 3','1','8395f21d-1128-4f38-a57f-4d400a24acd9.png,c0c45d08-70ce-4d0b-8358-0907c3eed0f9.png','mazda 3 2022'),(1,3000000.00,300000.00,4,'2025-08-17 22:02:23.873315','a55baed2-c664-4d85-8f77-fa21897d60a8','765178aa-35f7-4ef3-a56c-29b30dd46d6b','owner','Gasoline','AUTOMATIC','6e5c6bbf-df21-4f45-8efc-dad7b2186d59','2649bace-7996-416d-83e1-d1952b3f795d.png,a5c04493-befb-4512-b1d5-ed05590165ec.png','30A-12346','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Audi R8','1','3cc79757-fddd-461a-802f-f7f643219d86.png','Audi R8 2013'),(1,2500000.00,200000.00,2,'2025-07-23 22:07:44.370229','d1b4fa5f-7864-4719-974e-8c890ec796a2','e9407e98-3a83-45b9-b43f-55a67eadb031','owner','Gasoline','MANUAL CLUTCH','7095e697-7af0-43d8-8f39-0c3be1744b63','19bd61b8-7ac4-4f38-9e17-1be9aadd8279.png','20A-02916','Đống Đa','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Kawasaki Z1000','2','0efe4452-9878-4a1b-87a7-03ce5dc3b7c3.png','Kawasaki Z1000'),(1,2000000.00,200000.00,7,'2025-08-17 21:38:27.504251','df89e603-694e-44a5-874e-a2691377ae01','bba1377d-5646-4da2-8989-aa01ec1b6bb1','owner','Gasoline','AUTOMATIC','85601389-8a09-47bd-8971-a664d5b5627b','baf9ae9c-80a1-48c4-b050-8b448f6f6fe8.png','30A-12343','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Mercedes GLC300','1','94366b74-e2a6-42d6-a4bb-59dadcb1131c.png,cef3ad5e-3050-4094-80d8-ed04e1475c7a.png','Mercedes GLC300 '),(1,1000000.00,100000.00,2,'2025-07-23 22:05:09.032721','cba949be-3335-4837-af35-f735576ad8da','e9407e98-3a83-45b9-b43f-55a67eadb031','owner','Gasoline','MANUAL CLUTCH','9a88d293-89ce-4d9a-bc33-c183d969c52d','e69a6df8-6498-4f32-955a-fcf4685da2c1.png','29A-10293','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Ducati Scrambler 800cc','2','f90fe438-e0f3-4f24-b06c-f2cf0c95a81b.png','Ducati Scrambler 2020'),(1,1000000.00,100000.00,2,'2025-07-23 22:05:53.091522','0f6d8a43-966e-47e6-bcfd-6f961a5566cb','e9407e98-3a83-45b9-b43f-55a67eadb031','owner','Gasoline','MANUAL CLUTCH','b1d9bf2e-1f99-4f25-b30c-b43115946b89','bcfd31af-ce2b-4778-a9a8-21070bb914e6.png','21A-01923','Đống Đa','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','MT-09','2','afa49abf-8468-44da-ac3c-2191945ff51e.png','Yamaha MT-09 2019'),(1,530000.00,50000.00,4,'2025-08-14 21:55:52.792197','198ceffc-cf40-45f1-b630-39435cb80817','765178aa-35f7-4ef3-a56c-29b30dd46d6b','admin','Electric','AUTOMATIC','b95a0b58-8b48-4a98-85a7-061aa76c45dd','ba6be1f5-53e9-4f34-a6de-8e04f3ae4385.png,f1e852cd-cb8c-47bc-92b2-99014138b548.png,c1cb5670-7171-4b22-9605-7baf2e0d055d.png','40A-01923','Đà Nẵng',NULL,'','PENDING','7c80e262-ece5-4d76-ab1e-8eaa373904cf','Vinfast VF3','1','07f163d2-e590-456a-9cca-446c200d8c0b.png,e6c4068e-51e4-4006-b723-a81ca98e5b4b.png','VF3, Vinfast VF3 2024'),(1,2000000.00,200000.00,4,'2025-07-23 21:59:27.261440','28a3c52c-1341-4d79-909c-669c8882e107','765178aa-35f7-4ef3-a56c-29b30dd46d6b','owner','Gasoline','AUTOMATIC','c40764f9-c527-4d5f-a227-a018bfaaa534','d1b3c097-88f6-4492-acbe-87be44079a4a.png','30A-12345','Đống Đa','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','PENDING','6b59f416-d0b5-4d42-8d33-af59f25da4aa','MG5','1','eed9c295-0010-4189-a062-216e39c6002c.png','MG5 2020'),(1,1500000.00,100000.00,2,'2025-07-23 22:04:57.680718','3f9c98cc-92dd-4fa0-ba40-aad12a4c758c','e9407e98-3a83-45b9-b43f-55a67eadb031','owner','Gasoline','MANUAL CLUTCH','c799bb92-222a-4484-a6f5-be3315165e25','425d880e-6645-4343-9ca5-a5993ae58f6a.png','29A-10221','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','CBR650R','2','b6076848-9903-4a04-8194-e4fd40cbb53e.png','CBR650R 2015'),(1,500000.00,100000.00,2,'2025-08-03 21:36:03.255109','3f9c98cc-92dd-4fa0-ba40-aad12a4c758c','f9679089-c1a1-4500-bc21-6ffc303eac08','owner','Gasoline','SCOOTER','ca2136df-74c3-4dab-8547-e82f72b681fb','cac00ec1-0254-4fab-b02c-cb9f15a64465.png,eb933324-4410-48e4-818c-d33fb4656e08.png,b731edb9-db92-4c5d-bef3-4c325a796b98.png,31467eed-5f03-4549-9ecc-b42675e230b4.png','29A-01923','Đống Đa','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Honda SH160i','2','62e972f5-690b-4a4f-a01e-156a327da114.png','Honda SH160i 2024'),(1,500000.00,100000.00,4,'2025-07-23 22:02:37.377956','b10b59e0-e8e9-41f2-b93c-3169a2246c46','765178aa-35f7-4ef3-a56c-29b30dd46d6b','owner','Gasoline','AUTOMATIC','e6599fb8-18e5-45e1-9aa4-cba0e9bd479b','31180492-a948-4b03-b9bf-7acbc12f76c3.png','30A-01923','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','Kia morning','1','cd0e12f9-29f7-4c75-9f91-6600a9c5ef43.png','Kia morning 2010'),(1,2000000.00,200000.00,4,'2025-07-23 22:00:06.518929','63533e01-5726-465d-9f51-57c16a20f19f','765178aa-35f7-4ef3-a56c-29b30dd46d6b','owner','Gasoline','AUTOMATIC','f4cccae2-44fb-4e5c-912a-5714cbddfe7f','ea215e5e-8203-4cd4-abb8-f161fc431d5c.png','30A-12342','Hà Nội','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE','6b59f416-d0b5-4d42-8d33-af59f25da4aa','BMW M4','1','270e692d-3517-46c2-922f-64d88a68ce06.png','BMW M4 2022'),(1,2500000.00,200000.00,4,'2025-07-23 22:07:13.057884','fb52d150-e582-4552-8b48-d06f6ce32000','765178aa-35f7-4ef3-a56c-29b30dd46d6b','owner','Gasoline','AUTOMATIC','f93e8db2-f840-49f9-a478-be676872e008','b687bb0d-1f2d-4973-bb5b-243f0c21625c.png','20A-02913','Đống Đa','6b59f416-d0b5-4d42-8d33-af59f25da4aa','','AVAILABLE',NULL,'Toyota Camry','1','4ee33c7d-df46-4642-aec8-c89e33a68037.png','Toyota Camry');\n" +
                    "/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;\n" +
                    "UNLOCK TABLES;\n" +
                    "/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;\n" +
                    "\n" +
                    "/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\n" +
                    "/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n" +
                    "/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\n" +
                    "/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n" +
                    "/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n" +
                    "/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n" +
                    "/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;\n" +
                    "\n" +
                    "-- Dump completed on 2025-08-18  0:27:51\n"+ input,
            });

            // Add AI message
            const aiMessage = { text: response.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            const errorMessage = { text: "Sorry, I couldn't process your request.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Gemini AI Chat</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Start a conversation with Gemini AI</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={!input.trim() || isLoading}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Test;