package com.biblioteca.controller;

import com.biblioteca.model.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/livro")
public class LivroController {

    private static List<Livro> livros = new ArrayList<>();
    private static Long proximoId = 1L;

    // ROTA: GET http://localhost:8080/livro/livroteste
    @GetMapping("/listar")
    public List<Livro> listarlivros() {
        return livros;
    }

    // ROTA: POST http://localhost:8080/livro/cadastrar
    @PostMapping("/cadastrar")
    public String cadastrarlivro(@RequestBody Livro livro) {

        /*json: 
        {
        "nome": "NomeLivro",
        "autor": "AutorLivro",
        "categoria": "CategoriaLivro"
        }

        */
        livro.setId(proximoId++);
        livros.add(livro);
        livro.setDataEmprestimo(LocalDate.now());
        return "livro cadastrado com sucesso! \n" + livro.getNome() + " - Categoria: " + livro.getCategoria();
    }

    // ROTA: PUT http://localhost:8080/atualizar/{id}
    @PutMapping("/atualizar/{id}")
    public String atualizarlivro(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        for (Livro p : livros) {
            if (p.getId() == id) {
                p.setNome(livroAtualizado.getNome());
                p.setCategoria(livroAtualizado.getCategoria());
                p.setDataEmprestimo(livroAtualizado.getDataEmprestimo());
                return "livro atualizado com sucesso!";
            }
        }
        return "livro não encontrado!";
    }

    // ROTA: PUT http://localhost:8080/devolucao/{id}
    @PutMapping("/devolucao/{id}")
    public String atualizarDevolução(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        for (Livro p : livros) {
            if (p.getId() == id) {
                p.setDataDevolucao(LocalDate.now());
                return "devolução atualizada com sucesso!";
            }
        }
        return "livro não encontrado!";
    }

    // ROTA: DELETE http://localhost:8080/deletar/{id}
    @DeleteMapping("/deletar/{id}")
    public String deletarlivro(@PathVariable Long id) {
        for (Livro p : livros) {
            if (p.getId() == id) {
                livros.remove(p);
                return "livro removido com sucesso!";
            }
        }
        return "livro não encontrado!";
    }
}
