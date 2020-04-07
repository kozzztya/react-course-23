import React, { useState, useEffect, useCallback, Fragment } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import * as api from '../../api';
import { withError } from '../../HOCs/withError';
import { FadeTransitionSwitch } from '../../transitions/FadeTransitionSwitch/FadeTransitionSwitch';
import { CenterText } from '../../components/CenterText/CenterText';
import { withLoader } from '../../HOCs/withLoader';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import fadeTransition from '../../styles/FadeTransition.module.scss';
import CSSTransition from 'react-transition-group/CSSTransition';

const Container = styled.div`
  width: 300px;
  min-height: 130px;
`;

const CardContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransitionGroupStyled = styled(TransitionGroup)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const AttendanceFromZoomComponent = ({
  students,
  setPresentStatus,
  setErrorMessage,
  setIsLoading
}) => {
  const [webinarJoins, setWebinarJoins] = useState([]);
  const [joinIndex, setJoinIndex] = useState(0);

  const setPresentStatusByJoins = useCallback(
    (joinsWithStudentId) => {
      _.forEach(joinsWithStudentId, ({ studentId }) => {
        setPresentStatus(studentId);
      });
    },
    [setPresentStatus]
  );

  const setStudentIdForJoin = (participantId, studentId) =>
    setWebinarJoins(
      _.map(webinarJoins, (join) => {
        if (join.participantId === participantId) {
          return { ...join, studentId };
        }

        return join;
      })
    );

  const getNotMatchedStudents = useCallback(
    () =>
      _.filter(students, (student) => {
        const knownParticipant = _.find(webinarJoins, { studentId: student.id });
        return !knownParticipant;
      }),
    [webinarJoins, students]
  );

  const nextJoin = () => setJoinIndex(joinIndex + 1);

  const matchStudentAndParticipant = async (studentId, participantId) => {
    setPresentStatus(studentId);

    setStudentIdForJoin(participantId, studentId);
    await api.setStudentIdForParticipant(participantId, studentId);

    nextJoin();
  };

  useEffect(() => {
    (async () => {
      try {
        const joins = await api.getWebinarJoins();

        setPresentStatusByJoins(_.filter(joins, ({ studentId }) => studentId));
        setWebinarJoins(_.filter(joins, ({ studentId }) => !studentId));
      } catch (err) {
        setErrorMessage(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setIsLoading, setErrorMessage, setPresentStatusByJoins]);

  const webinarJoin = webinarJoins[joinIndex];
  const label = webinarJoin ? webinarJoin.participantName : 'Все студенты отмечены';
  const studentsOptions = getNotMatchedStudents();

  return (
    <Container>
      <Fragment>
        <CardContentContainer>
          <CardContent>
            <FadeTransitionSwitch transitionKey={joinIndex}>
              <CenterText>
                <Typography variant="h5">{label}</Typography>
              </CenterText>
            </FadeTransitionSwitch>
          </CardContent>
        </CardContentContainer>

        <CardActions>
          <TransitionGroupStyled>
            {webinarJoin &&
              _.map(studentsOptions, (student) => (
                <CSSTransition key={student.id} timeout={400} classNames={fadeTransition}>
                  <Button
                    key={student.id}
                    size="small"
                    onClick={() =>
                      matchStudentAndParticipant(student.id, webinarJoin.participantId)
                    }
                  >
                    {student.name}
                  </Button>
                </CSSTransition>
              ))}
          </TransitionGroupStyled>
        </CardActions>
      </Fragment>
    </Container>
  );
};

export const AttendanceFromZoom = withLoader(withError(AttendanceFromZoomComponent), {
  LoaderContainer: Container
});
