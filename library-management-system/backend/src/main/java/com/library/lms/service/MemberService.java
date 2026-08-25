package com.library.lms.service;

import com.library.lms.dto.MemberDTO;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.model.Member;
import com.library.lms.model.TransactionStatus;
import com.library.lms.repository.MemberRepository;
import com.library.lms.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final TransactionRepository transactionRepository;

    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return toDTO(member);
    }

    public List<MemberDTO> searchMembers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllMembers();
        }
        return memberRepository.search(keyword.trim()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MemberDTO createMember(MemberDTO dto) {
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("A member with email " + dto.getEmail() + " already exists");
        }
        Member member = new Member();
        member.setName(dto.getName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());
        member.setRegistrationDate(dto.getRegistrationDate() != null ? dto.getRegistrationDate() : LocalDate.now());
        Member saved = memberRepository.save(member);
        return toDTO(saved);
    }

    @Transactional
    public MemberDTO updateMember(Long id, MemberDTO dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        if (!member.getEmail().equals(dto.getEmail()) && memberRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("A member with email " + dto.getEmail() + " already exists");
        }

        member.setName(dto.getName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());
        if (dto.getRegistrationDate() != null) {
            member.setRegistrationDate(dto.getRegistrationDate());
        }

        Member saved = memberRepository.save(member);
        return toDTO(saved);
    }

    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        boolean hasActiveLoans = !transactionRepository.findByMemberId(id).stream()
                .filter(t -> t.getStatus() == TransactionStatus.ISSUED)
                .collect(Collectors.toList())
                .isEmpty();

        if (hasActiveLoans) {
            throw new BadRequestException("Cannot delete member: member has books currently issued");
        }

        memberRepository.delete(member);
    }

    private MemberDTO toDTO(Member member) {
        return new MemberDTO(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getAddress(),
                member.getRegistrationDate()
        );
    }
}
