package de.hsfulda.et.wbs.security.resource;

import de.hsfulda.et.wbs.core.HalJsonResource;
import de.hsfulda.et.wbs.security.haljson.AuthoritiesHalJson;
import de.hsfulda.et.wbs.security.repository.AuthorityRepository;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static de.hsfulda.et.wbs.Application.CONTEXT_ROOT;
import static de.hsfulda.et.wbs.core.HalJsonResource.HAL_JSON;

/**
 * Über diese Resource werden die Rechte ermittelt die einem Benutzer vergeben werden können.
 */
@RestController
@RequestMapping(AuthorityResource.PATH)
public class AuthorityResource {

    public static final String PATH = CONTEXT_ROOT + "/authorities";

    private final AuthorityRepository authorityRepository;

    public AuthorityResource(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    @GetMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('TRAEGER_MANAGER')")
    HttpEntity<HalJsonResource> get() {
        return new HttpEntity<>(new AuthoritiesHalJson(authorityRepository.findAllByAktivTrueOrderById()));
    }
}