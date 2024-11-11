package world.moducare.domain.product.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "elastic_products")
public class ElasticProduct {

    @Id
    private String id;

    private String 제품명;

    private String 가격;

    private String 제품_이미지;

    private String 제품_링크;

    private String 세부제품특징;

    private String 주요제품특징;

    private String 헤어타입;

    private String 두피타입;

    private String 모발타입;

    @Field(type = FieldType.Dense_Vector, dims = 768)  // 필요 시 벡터 필드를 추가합니다.
    private float[] descriptionVector;

    // Getters and Setters
}
