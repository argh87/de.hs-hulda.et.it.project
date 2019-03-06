package de.hsfulda.et.wbs.http.resource;

import de.hsfulda.et.wbs.core.HalJsonResource;
import de.hsfulda.et.wbs.entity.Benutzer;
import de.hsfulda.et.wbs.http.haljson.BenutzerHalJson;
import de.hsfulda.et.wbs.repository.BenutzerRepository;
import de.hsfulda.et.wbs.security.User;
import de.hsfulda.et.wbs.service.AccessService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static de.hsfulda.et.wbs.core.HalJsonResource.HAL_JSON;
import static de.hsfulda.et.wbs.http.resource.BenutzerResource.PATH;

/**
 * Diese Resource stellt einen Träger dar. Hier kann ein Träger aufgerufen, bearbeitet und gelöscht werden.
 */
@RestController
@RequestMapping(PATH)
public class BenutzerResource {

    public static final String PATH = "/benutzer/{id}";

    private final BenutzerRepository benutzerRepository;
    private final AccessService accessService;

    public BenutzerResource(BenutzerRepository benutzerRepository, AccessService accessService) {
        this.benutzerRepository = benutzerRepository;
        this.accessService = accessService;
    }

    /**
     * Ermittelt einen Benutzer anhand der ID.
     *
     * @param user angemeldeter Benutzer
     * @param id   ID des Benutzers aus dem Pfad
     * @return gefundenen Träger. Anderfalls 404
     */
    @GetMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('READ_ALL')")
    HttpEntity<HalJsonResource> get(@AuthenticationPrincipal User user, @PathVariable("id") Long id) {
        return accessService.hasAccess(user, id, () -> {
            Optional<Benutzer> benutzer = benutzerRepository.findById(id);
            return benutzer.<HttpEntity<HalJsonResource>>map(b -> new HttpEntity<>(new BenutzerHalJson(b)))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        });
    }


    @PutMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('TRAEGER_MANAGER')")
    HttpEntity<HalJsonResource> put(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Long id,
            @RequestBody Benutzer benutzer) {
        return accessService.hasAccess(user, id, () -> {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        });
    }

    @DeleteMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('TRAEGER_MANAGER')")
    HttpEntity<HalJsonResource> delete(@AuthenticationPrincipal User user, @PathVariable("id") Long id) {
        return accessService.hasAccess(user, id, () -> {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        });
    }
}