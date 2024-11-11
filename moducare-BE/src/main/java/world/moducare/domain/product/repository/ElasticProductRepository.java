package world.moducare.domain.product.repository;

import world.moducare.domain.product.entity.ElasticProduct;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElasticProductRepository extends ElasticsearchRepository<ElasticProduct, String> {
    // 추가적인 커스텀 쿼리 메서드를 정의할 수 있습니다.
}
