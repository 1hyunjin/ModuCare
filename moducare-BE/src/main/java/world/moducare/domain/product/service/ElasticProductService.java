//package world.moducare.domain.product.service;
//
//import world.moducare.domain.product.entity.ElasticProduct;
//import world.moducare.domain.product.repository.ElasticProductRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//public class ElasticProductService {
//
//    @Autowired
//    private ElasticProductRepository elasticProductRepository;
//
//    @Autowired
//    private DatabaseProductRepository databaseProductRepository; // 기존 DB의 products 테이블 리포지토리
//
//    // 기존 DB에서 데이터를 가져와 Elasticsearch에 저장
//    public void indexProductsFromDatabase() {
//        List<DatabaseProduct> products = databaseProductRepository.findAll();
//        for (DatabaseProduct dbProduct : products) {
//            ElasticProduct elasticProduct = new ElasticProduct();
//            elasticProduct.setId(String.valueOf(dbProduct.getId()));
//            elasticProduct.set제품명(dbProduct.get제품명());
//            elasticProduct.set가격(dbProduct.get가격());
//            elasticProduct.set제품_이미지(dbProduct.get제품_이미지());
//            elasticProduct.set제품_링크(dbProduct.get제품_링크());
//            elasticProduct.set세부제품특징(dbProduct.get세부제품특징());
//            elasticProduct.set주요제품특징(dbProduct.get주요제품특징());
//            elasticProduct.set헤어타입(dbProduct.get헤어타입());
//            elasticProduct.set두피타입(dbProduct.get두피타입());
//            elasticProduct.set모발타입(dbProduct.get모발타입());
//
//            // 필요 시 descriptionVector 설정
//            // elasticProduct.setDescriptionVector(...);
//
//            // Elasticsearch에 저장
//            elasticProductRepository.save(elasticProduct);
//        }
//    }
//}
