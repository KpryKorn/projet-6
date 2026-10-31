package oc.mdd.dto;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;

public record PageResponse<T>(List<T> content, int page, int size, boolean hasNext, long totalElements) {

    public static <E, T> PageResponse<T> of(Page<E> page, Function<List<E>, List<T>> mapper) {
        return new PageResponse<>(mapper.apply(page.getContent()), page.getNumber(), page.getSize(),
                page.hasNext(), page.getTotalElements());
    }
}
