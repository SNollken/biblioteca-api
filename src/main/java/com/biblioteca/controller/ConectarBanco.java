package com.biblioteca.controller;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.biblioteca.model.Livro;

@Service
public class ConectarBanco {

    private final JdbcTemplate jdbc;

    public ConectarBanco(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<Livro> listarTodos() {
        return jdbc.query(
            "SELECT * FROM livros ORDER BY id",
            (rs, i) -> {
                Livro l = new Livro();
                l.setId(rs.getLong("id"));
                l.setNome(rs.getString("nome"));
                l.setAutor(rs.getString("autor"));
                l.setCategoria(rs.getString("categoria"));
                l.setEmprestado(rs.getBoolean("emprestado"));
                return l;
            }
        );
    }

    public Livro salvar(Livro livro) {
        jdbc.update(
            "INSERT INTO livros (nome, autor, categoria) VALUES (?, ?, ?)",
            livro.getNome(), livro.getAutor(), livro.getCategoria()
        );
        return livro;
    }

    public boolean atualizar(Long id, Livro livro) {
        return jdbc.update(
            "UPDATE livros SET nome = ?, autor = ?, categoria = ? WHERE id = ?",
            livro.getNome(), livro.getAutor(), livro.getCategoria(), id
        ) > 0;
    }

    public boolean deletar(Long id) {
        return jdbc.update("DELETE FROM livros WHERE id = ?", id) > 0;
    }
}
