package de.hsfulda.et.wbs.repository;

import de.hsfulda.et.wbs.entity.Traeger;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface AccessRepository extends Repository<Traeger, Long> {

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b where b.id = :userId " +
            "and t.id = (select t2.id from Traeger t2 join t2.benutzer b2 where b2.id = :benutzerId and b2.aktiv = true)")
    Long findTraegerByUserAndBenutzerId(@Param("userId") Long userID, @Param("benutzerId") Long benutzerId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b JOIN t.zielorte z where b.id = :userId " +
            "and z.id = :zielortId")
    Long findTraegerByUserAndZielortId(@Param("userId") Long userID, @Param("zielortId") Long zielortId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b where b.id = :userId and t.id = :traegerId")
    Long findTraegerByUserAndTraegerId(@Param("userId") Long userID, @Param("traegerId") Long traegerId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b JOIN t.kategorien k where b.id = :userId " +
            "and k.id = :kategorieId")
    Long findTraegerByUserAndKategorieId(@Param("userId") Long userID, @Param("kategorieId") Long kategorieId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b JOIN t.kategorien k JOIN k.groessen g " +
            "where b.id = :userId and g.id = :groesseId")
    Long findTraegerByUserAndGroesseId(@Param("userId") Long userID, @Param("groesseId") Long groesseId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b JOIN t.zielorte z JOIN z.bestaende bs " +
            "where b.id = :userId and bs.id = :bestandId")
    Long findTraegerByUserAndBestandId(@Param("userId") Long id, @Param("bestandId") Long bestandId);

    @Query("SELECT COUNT(t) FROM Traeger t JOIN t.benutzer b JOIN t.zielorte z where b.id = :userId " +
            "and z.id = (SELECT v.id FROM Transaktion t JOIN t.von v WHERE t.id = :transaktionId)")
    Long findTraegerByUserAndTransaktionId(@Param("userId") Long id, @Param("transaktionId") Long transaktionId);
}
