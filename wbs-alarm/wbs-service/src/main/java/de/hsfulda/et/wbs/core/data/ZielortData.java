package de.hsfulda.et.wbs.core.data;

import de.hsfulda.et.wbs.core.dto.ZielortDto;

public interface ZielortData extends ZielortDto {

    Long getId();

    boolean isAuto();

    boolean isEingang();

    boolean isLager();

    boolean isAktiv();

    boolean isErfasst();

    TraegerData getTraeger();

}
