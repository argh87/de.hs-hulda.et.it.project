package de.hsfulda.et.wbs.action.zielort.impl;

import de.hsfulda.et.wbs.action.zielort.DeleteZielortAction;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.exception.ResourceNotFoundException;
import de.hsfulda.et.wbs.core.exception.ZielortDeletionException;
import de.hsfulda.et.wbs.repository.BestandRepository;
import de.hsfulda.et.wbs.repository.ZielortRepository;
import de.hsfulda.et.wbs.service.AccessService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Component
public class DeleteZielortActionImpl implements DeleteZielortAction {

    private final ZielortRepository repo;
    private final BestandRepository bestandRepository;
    private final AccessService accessService;

    public DeleteZielortActionImpl(ZielortRepository repo, BestandRepository bestandRepository,
            AccessService accessService) {
        this.repo = repo;
        this.bestandRepository = bestandRepository;
        this.accessService = accessService;
    }

    @Override
    public void perform(WbsUser user, Long id) {
        accessService.hasAccessOnZielort(user, id, () -> {
            if (!repo.existsById(id)) {
                throw new ResourceNotFoundException("Zielort mit ID {0} nicht gefunden.", id);
            }

            if (bestandRepository.countAllByZielortId(id) > 0L) {
                throw new ZielortDeletionException(
                        "Zielort kann nicht inaktiv gesetzt werden, da noch Bestände " + "vorhanden sind.");
            }

            repo.deactivate(id);
            return null;
        });
    }
}
