package com.biblioteca.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
public class LivroController {

    private static List<Livro> livros = new ArrayList<>();
    private static Long proximoId = 1L;

    // ROTA: GET http://localhost:9090/livros
    @GetMapping
    public List<Livro> listarlivros() {
        return livros;
    }

    // ROTA: POST http://localhost:9090/livros
    @PostMapping
    public String cadastrarlivro(@RequestBody Livro livro) {
        livro.setId(proximoId++);
        livro.setDataEmprestimo(LocalDate.now());
        livros.add(livro);
        return "livro cadastrado com sucesso! \n" + livro.getNome() + " - categoria: " + livro.getCategoria();
    }

    /*
    json teste

    {
        "nome": "Livro1",
        "autor": "Autor1",
        "categoria": "Categoria1"
    }
    */

    // ROTA: PUT http://localhost:9090/livros/{id}
    @PutMapping("/{id}")
    public String atualizarlivro(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        for (Livro l : livros) {
            if (l.getId().equals(id)) {
                l.setNome(livroAtualizado.getNome());
                l.setAutor(livroAtualizado.getAutor());
                l.setCategoria(livroAtualizado.getCategoria());
                l.setDataEmprestimo(livroAtualizado.getDataEmprestimo());
                l.setDataDevolucao(livroAtualizado.getDataDevolucao());
                return "livro atualizado com sucesso!";
            }
        }
        return "livro não encontrado!";
    }

    /*
    json teste

    {
        "nome": "Livro1",
        "autor": "Autor1",
        "categoria": "Categoria1",
        "dataEmprestimo": "2026-05-27",
        "dataDevolucao": "2026-06-03"
    }
    */

    // ROTA: DELETE http://localhost:9090/livros/{id}
    @DeleteMapping("/{id}")
    public String deletarlivro(@PathVariable Long id) {
        for (Livro l : livros) {
            if (l.getId().equals(id)) {
                livros.remove(l);
                return "livro removido com sucesso!";
            }
        }
        return "livro não encontrado!";
    }
}
