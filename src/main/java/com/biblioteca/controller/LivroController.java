package com.biblioteca.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblioteca.model.Livro;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    private final ConectarBanco banco;

    public LivroController(ConectarBanco banco) {
        this.banco = banco;
    }

    // ROTA: GET http://localhost:9090/livros
    @GetMapping
    public List<Livro> listar() {
        return banco.listarTodos();
    }

    // ROTA: POST http://localhost:9090/livros
    @PostMapping
    public Livro cadastrar(@RequestBody Livro livro) {
        return banco.salvar(livro);
    }

    // ROTA: PUT http://localhost:9090/livros/{id}
    @PutMapping("/{id}")
    public String atualizar(@PathVariable("id") Long id, @RequestBody Livro livro) {
        boolean atualizado = banco.atualizar(id, livro);
        if (atualizado) {
            return "livro atualizado com sucesso!";
        }
        return "livro nao encontrado!";
    }

    // ROTA: DELETE http://localhost:9090/livros/{id}
    @DeleteMapping("/{id}")
    public String deletar(@PathVariable("id") Long id) {
        boolean deletado = banco.deletar(id);
        if (deletado) {
            return "livro removido com sucesso!";
        }
        return "livro não encontrado!";
    }
}
